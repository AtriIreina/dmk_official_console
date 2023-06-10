import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Select, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormSelect,
  ProFormRadio,
  ProFormDateTimePicker,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from './service';
import type { TableListItem, TableListPagination } from './data';
import type { ProFormInstance } from '@ant-design/pro-components';

import handleRequest from '../../../utils/handleRequest';

/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  return handleRequest(addRule({ ...fields }), '添加成功');
};
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
  return handleRequest(
    updateRule({
      ...currentRow,
      ...fields,
    }),
    '修改成功',
  );
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListItem[]) => {
  return handleRequest(
    removeRule({
      key: selectedRows.map((row) => row.id),
    }),
    '删除成功',
  );
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  // const [stepFormCurrentStep, setStepFormCurrentStep] = useState(0);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  /** 国际化配置 */

  //TODO: 修改数据展示
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户详情id',
      dataIndex: 'id',
      tip: '会员的基本标识',
      sorter: (a, b) => {
        return a.id - b.id;
      },
    },
    {
      title: '用户id',
      dataIndex: 'userId',
      tip: '用户id是和会员id唯一绑定的',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
      sorter: (a, b) => {
        return a.userId - b.userId;
      },
    },
    {
      title: '上级会员id',
      dataIndex: 'pid',
      hideInTable: true,
      tip: '指向当前会员的上级',
      sorter: (a, b) => {
        return a.pid - b.pid;
      },
    },
    {
      title: '会员昵称',
      dataIndex: 'nickname',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '真实姓名',
      dataIndex: 'realname',
      hideInTable: true,
    },
    {
      title: '身份证',
      dataIndex: 'idcard',
      hideInTable: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      valueType: 'avatar',
      hideInSearch: true,
    },
    {
      title: '生日',
      dataIndex: 'birtyday',
      valueType: 'date',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      filters: true,
      onFilter: true,
      valueEnum: {
        0: '未知',
        1: '男',
        2: '女',
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '简介',
      dataIndex: 'introduction',
      hideInTable: true,
    },
    {
      title: '积分',
      dataIndex: 'points',
      hideInSearch: true,
      sorter: (a, b) => {
        return a.points - b.points;
      },
    },
    {
      title: '余额',
      dataIndex: 'balance',
      hideInSearch: true,
      sorter: (a, b) => {
        return a.balance - b.balance;
      },
    },
    {
      title: '冻结积分',
      dataIndex: 'frozenPoints',
      hideInSearch: true,
      sorter: (a, b) => {
        return a.frozenPoints - b.frozenPoints;
      },
    },
    {
      title: '冻结余额',
      dataIndex: 'frozenBalance',
      hideInSearch: true,
      sorter: (a, b) => {
        return a.frozenBalance - b.frozenBalance;
      },
    },
    {
      title: '总消费金额',
      dataIndex: 'totalConsume',
      hideInSearch: true,
      sorter: (a, b) => {
        return a.totalConsume - b.totalConsume;
      },
    },
    {
      title: '会员等级',
      dataIndex: 'memberLevelId',
      sorter: (a, b) => {
        return a.memberLevelId - b.memberLevelId;
      },
      //TODO: WAIT DO 会员等级 动态
      valueEnum: {
        '1': {
          text: '普通',
          color: '#eee',
        },
        '2': {
          text: '银牌',
          color: 'silver',
        },
        '3': {
          text: '金牌',
          color: 'gold',
        },
        '4': {
          text: '钻石',
          color: 'blue',
        },
      },
    },
    {
      title: '省',
      dataIndex: 'province',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '市',
      dataIndex: 'city',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '县/区',
      dataIndex: 'area',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '详细地址',
      dataIndex: 'addressDetail',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '封禁天数',
      dataIndex: 'banDays',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        '-1': {
          text: '封禁',
          status: 'Error',
        },
        '0': {
          text: '已注销',
          status: 'Default',
        },
        '1': {
          text: '正常',
          status: 'success',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <a
          key="delete"
          onClick={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const handleSelect = (value: string) => {
    //TODO: WAIT 导出文件
    console.log(`selected ${value}`);
  };

  const memberLevelOptions = [
    { label: '普通会员', value: 1 },
    { label: '银牌会员', value: 2 },
    { label: '金牌会员', value: 3 },
    { label: '钻石会员', value: 4 },
  ];

  const statusOptions = [
    { label: '启用', value: 1 },
    { label: '注销', value: 0 },
    { label: '封禁', value: -1 },
  ];

  const restFormRef = useRef<ProFormInstance>();
  const formRef = useRef<ProFormInstance>();

  // 确认删除对话框
  const [isModalOpen, setIsModalOpen] = useState(false); //是否显示
  const [confirmLoading, setConfirmLoading] = useState(false); //是否等待

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    //确认删除
    await handleRemove(selectedRowsState);
    //设置等待1s
    setTimeout(() => {
      setIsModalOpen(false);
      setConfirmLoading(false);
    }, 2000);
    setSelectedRows([]);
    actionRef.current?.reloadAndRest?.();
  };
  const handleCancel = () => {
    //取消删除
    setIsModalOpen(false);
  };

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="查询表格"
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        search={{
          labelWidth: 70,
        }}
        toolBarRender={() => [
          <Select
            defaultValue="导出数据"
            style={{ width: 150 }}
            onSelect={handleSelect}
            options={[
              { value: 'excel', label: '导出 Excel 表格' },
              { value: 'pdf', label: '导出 PDF 文档' },
            ]}
          />,
          <Button
            type="primary"
            key="add"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建数据
          </Button>,
        ]}
        //request={rule}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: {
            pageSize: number;
            current: number;
          },
          sort,
          filter,
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const { current, pageSize, ...options } = params;
          const data = await rule(
            {
              pageSize: params.pageSize,
              current: params.current,
            },
            options,
          );
          return {
            data: data.result.items,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: data.msg == 'success',
            // 不传会使用 data 的长度，如果是分页一定要传
            // total: number,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
            console.log('selectedRows', selectedRows.length);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              {/* <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span> */}
            </div>
          }
        >
          <Button
            type="primary"
            danger
            onClick={async () => {
              // await handleRemove(selectedRowsState);
              // setSelectedRows([]);
              // actionRef.current?.reloadAndRest?.();
              showModal();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <Modal
        title="系统提示"
        open={isModalOpen}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>确认删除数据? (可从回收站找回)</p>
      </Modal>
      <ModalForm
        title="新建数据"
        formRef={restFormRef}
        visible={createModalVisible}
        onVisibleChange={(visiable) => {
          handleModalVisible(visiable);
          restFormRef.current?.resetFields();
        }}
        //通过 formRef 重置
        submitter={{
          searchConfig: {
            resetText: '重置',
          },
          resetButtonProps: {
            onClick: () => {
              restFormRef.current?.resetFields();
            },
          },
        }}
        //提交表单且数据验证成功
        onFinish={async (value) => {
          const success = await handleAdd(value as TableListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        layout={'vertical'}
      >
        {/* TODO: 修改新增表单 */}
        <ProForm.Group title="基本信息">
          <ProFormText
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请填写昵称' }]}
          />
          <ProFormText name="realname" label="真实姓名" />
          <ProFormDigit name="pid" label="上级会员ID" initialValue={0} />
          {/* TODO: WAIT DO 会员等级 动态 */}
          <ProFormSelect
            name="memberLevelId"
            label="用户级别id"
            width={'xs'}
            options={memberLevelOptions}
            initialValue={memberLevelOptions[0].value}
          />
          <ProFormSelect
            name="status"
            label="状态"
            width={'xs'}
            options={statusOptions}
            initialValue={statusOptions[0].value}
          />
          <ProFormText name="avatar" label="用户头像" />
          <ProFormDigit name="banDays" label="封禁天数" initialValue={0} />
        </ProForm.Group>
        <ProForm.Group title="个人信息">
          <ProFormText name="idcard" label="身份证" />
          <ProFormDatePicker name="birthday" label="生日" />
          <ProFormRadio.Group
            name="sex"
            label="用户性别"
            options={[
              {
                label: '未知',
                value: '0',
              },
              {
                label: '男',
                value: '1',
              },
              {
                label: '女',
                value: '2',
              },
            ]}
          />
          <ProFormText name="email" label="邮箱" />
          <ProFormText name="phone" label="手机号" />
          <ProFormTextArea width="lg" name="introduction" label="简介" />
        </ProForm.Group>
        <ProForm.Group title="积分信息">
          <ProFormDigit name="points" label="用户积分" initialValue={0} />
          <ProFormDigit name="balance" label="用户余额" initialValue={0} />
          <ProFormDigit name="frozenPoints" label="冻结积分" initialValue={0} />
          <ProFormDigit name="frozenBalance" label="冻结余额" initialValue={0} />
          <ProFormDigit name="totalConsume" label="总消费金额" initialValue={0} />
        </ProForm.Group>
        <ProForm.Group title="地址信息">
          <ProFormDigit name="province" label="省编号" />
          <ProFormDigit name="city" label="市编号" />
          <ProFormDigit name="area" label="区县编号" />
          <ProFormTextArea name="addressDetail" label="详细地址" width="xl" />
        </ProForm.Group>
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
          // setStepFormCurrentStep(0);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
