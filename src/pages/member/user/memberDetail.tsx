import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Badge, Card, Descriptions, Divider, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import React from 'react';
import { useRequest } from 'umi';
// import type { BasicGood, BasicProgress } from './data';
// import { queryBasicProfile } from './service';
// import styles from './style.less';
import { request } from 'umi';

import { TableListItem as Member } from '../member/data';
import { TableListItem as User } from '../user/data';
import { getByUserId } from '../member/service';

type BasicGood = {
  id: string;
  name?: string;
  barcode?: string;
  price?: string;
  num?: string | number;
  amount?: string | number;
};

type BasicProgress = {
  key: string;
  time: string;
  rate: string;
  status: string;
  operator: string;
  cost: string;
};

async function queryBasicProfile(): Promise<{
  data: {
    basicProgress: BasicProgress[];
    basicGoods: BasicGood[];
  };
}> {
  return request('/api/profile/basic');
}

const progressColumns: ProColumns<BasicProgress>[] = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text: React.ReactNode) => {
      if (text === 'success') {
        return <Badge status="success" text="成功" />;
      }
      return <Badge status="processing" text="进行中" />;
    },
  },

  {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
  },
];

const Basic: FC = (props) => {
  const { data, loading } = useRequest(() => {
    return queryBasicProfile();
  });

  const { basicGoods, basicProgress } = data || {
    basicGoods: [],
    basicProgress: [],
  };

  // console.log('props', props);
  // console.log('props.user:', props.user);

  const [member, setMember] = useState<Member>();

  const getMember: Member = async () => {
    const result = await getByUserId({ userId: props.user.id });
    console.log(result);
    return result.result[0];
  };

  // const member: Member = async () => {
  //   const result = await getByUserId({ userId: props.user.id });
  //   console.log(result);
  //   return result.result[0];
  // };

  useEffect(async () => {
    const hide = message.loading('正在查询用户');
    const result = await getMember();
    setMember(result);
    hide();

    console.log('member', member);
  }, [props.user]);

  const renderContent = (value: any, _: any, index: any) => {
    const obj: {
      children: any;
      props: { colSpan?: number };
    } = {
      children: value,
      props: {},
    };
    if (index === basicGoods.length) {
      obj.props.colSpan = 0;
    }
    return obj;
  };

  // const goodsColumns: ProColumns<BasicGood>[] = [
  //   {
  //     title: '商品编号',
  //     dataIndex: 'id',
  //     key: 'id',
  //     render: (text: React.ReactNode, _: any, index: number) => {
  //       if (index < basicGoods.length) {
  //         return <span>{text}</span>;
  //       }
  //       return {
  //         children: <span style={{ fontWeight: 600 }}>总计</span>,
  //         props: {
  //           colSpan: 4,
  //         },
  //       };
  //     },
  //   },
  //   {
  //     title: '商品名称',
  //     dataIndex: 'name',
  //     key: 'name',
  //     render: renderContent,
  //   },
  //   {
  //     title: '商品条码',
  //     dataIndex: 'barcode',
  //     key: 'barcode',
  //     render: renderContent,
  //   },
  //   {
  //     title: '单价',
  //     dataIndex: 'price',
  //     key: 'price',
  //     align: 'right' as 'left' | 'right' | 'center',
  //     render: renderContent,
  //   },
  //   {
  //     title: '数量（件）',
  //     dataIndex: 'num',
  //     key: 'num',
  //     align: 'right' as 'left' | 'right' | 'center',
  //     render: (text: React.ReactNode, _: any, index: number) => {
  //       if (index < basicGoods.length) {
  //         return text;
  //       }
  //       return <span style={{ fontWeight: 600 }}>{text}</span>;
  //     },
  //   },
  //   {
  //     title: '金额',
  //     dataIndex: 'amount',
  //     key: 'amount',
  //     align: 'right' as 'left' | 'right' | 'center',
  //     render: (text: React.ReactNode, _: any, index: number) => {
  //       if (index < basicGoods.length) {
  //         return text;
  //       }
  //       return <span style={{ fontWeight: 600 }}>{text}</span>;
  //     },
  //   },
  // ];

  return (
    // <PageContainer>
    <Card bordered={false}>
      <Descriptions title="基本信息" style={{ marginBottom: 32 }}>
        <Descriptions.Item label="会员昵称">{member?.nickname}</Descriptions.Item>
        <Descriptions.Item label="上级会员">{member?.pid}</Descriptions.Item>
        <Descriptions.Item label="用户级别">{member?.memberLevelId} 级</Descriptions.Item>
        <Descriptions.Item label="用户状态">{member?.status}</Descriptions.Item>
        <Descriptions.Item label="封禁天数">{member?.banDays} 天</Descriptions.Item>
      </Descriptions>
      <Descriptions title="个人信息" style={{ marginBottom: 32 }}>
        <Descriptions.Item label="真实姓名">{member?.realname}</Descriptions.Item>
        <Descriptions.Item label="身份证">{member?.idcard}</Descriptions.Item>
        <Descriptions.Item label="性别">
          {member?.sex == 0 ? '未知' : member?.sex == 1 ? '男' : '女'}
        </Descriptions.Item>
        <Descriptions.Item label="手机号">{member?.phone}</Descriptions.Item>
      </Descriptions>
      <Divider style={{ marginBottom: 32 }} />
      <Descriptions title="积分信息" style={{ marginBottom: 32 }}>
        <Descriptions.Item label="用户积分">{member?.points} 分</Descriptions.Item>
        <Descriptions.Item label="用户余额">{member?.balance}</Descriptions.Item>
        <Descriptions.Item label="冻结积分">{member?.frozenPoints}</Descriptions.Item>
        <Descriptions.Item label="冻结余额">{member?.frozenBalance}</Descriptions.Item>
        <Descriptions.Item label="总消费金额">{member?.totalConsume}</Descriptions.Item>
      </Descriptions>
      <Divider style={{ marginBottom: 32 }} />
      <Descriptions title="地址信息" style={{ marginBottom: 32 }}>
        <Descriptions.Item label="省编号">{member?.province}</Descriptions.Item>
        <Descriptions.Item label="市编号">{member?.city}</Descriptions.Item>
        <Descriptions.Item label="区县编号">{member?.area}</Descriptions.Item>
        <Descriptions.Item label="详细地址">{member?.addressDetail}</Descriptions.Item>
      </Descriptions>
    </Card>
    // </PageContainer>
  );
};

export default Basic;
