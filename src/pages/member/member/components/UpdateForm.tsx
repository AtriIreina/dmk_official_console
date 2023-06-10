import React, { useState } from 'react';
import { Modal } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
  ProForm,
  ProFormDigit,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import type { TableListItem } from '../data';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<TableListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
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

//TODO: 修改分步表单
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [current, setCurrent] = useState<number>(0);
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
        current: current,
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{
              padding: '32px 40px 48px',
            }}
            destroyOnClose
            title="修改信息"
            open={props.updateModalVisible}
            footer={submitter}
            onCancel={() => {
              console.log(current);
              props.onCancel();
              setCurrent(0);
              console.log(current);
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          nickname: props.values.nickname,
          realname: props.values.realname,
          pid: props.values.pid,
          memberLevelId: props.values.memberLevelId,
          status: props.values.status,
          avatar: props.values.avatar,
          banDays: props.values.banDays,
        }}
        title="基本信息"
      >
        <ProForm.Group>
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
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          idcard: props.values.idcard,
          birthday: props.values.birthday,
          sex: props.values.sex,
          email: props.values.email,
          phone: props.values.phone,
          introduction: props.values.introduction,
        }}
        title="个人信息"
      >
        <ProForm.Group>
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
      </StepsForm.StepForm>

      <StepsForm.StepForm
        initialValues={{
          points: props.values.points,
          balance: props.values.balance,
          frozenPoints: props.values.frozenPoints,
          frozenBalance: props.values.frozenBalance,
          totalConsume: props.values.totalConsume,
        }}
        title="积分信息"
      >
        <ProForm.Group>
          <ProFormDigit name="points" label="用户积分" initialValue={0} />
          <ProFormDigit name="balance" label="用户余额" initialValue={0} />
          <ProFormDigit name="frozenPoints" label="冻结积分" initialValue={0} />
          <ProFormDigit name="frozenBalance" label="冻结余额" initialValue={0} />
          <ProFormDigit name="totalConsume" label="总消费金额" initialValue={0} />
        </ProForm.Group>
        {/* <ProFormSelect
          name="target"
          width="md"
          label="监控对象"
          valueEnum={{
            0: '表一',
            1: '表二',
          }}
        />
        <ProFormRadio.Group
          name="type"
          label="规则类型"
          options={[
            {
              value: '0',
              label: '强',
            },
            {
              value: '1',
              label: '弱',
            },
          ]}
        /> */}
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          province: props.values.province,
          city: props.values.city,
          area: props.values.area,
          addressDetail: props.values.addressDetail,
        }}
        title="地址信息"
      >
        <ProForm.Group>
          <ProFormDigit name="province" label="省编号" />
          <ProFormDigit name="city" label="市编号" />
          <ProFormDigit name="area" label="区县编号" />
          <ProFormTextArea name="addressDetail" label="详细地址" width="xl" />
        </ProForm.Group>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
