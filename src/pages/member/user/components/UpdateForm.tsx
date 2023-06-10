import React, { useState } from 'react';
import { Modal, Radio, message } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProForm,
  ProFormDigit,
  ProFormItem,
  ProFormUploadButton,
  ProFormUploadDragger,
  ProFormDateTimePicker,
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

const statusOptions = [
  { label: '使用中', value: 1 },
  { label: '未启用', value: 0 },
];

//TODO: 修改分步表单
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [current, setCurrent] = useState<number>(0);
  //选择文件上传方式
  const [uploadMethod, setUploadMethod] = useState('upload');
  //图片拖拽上传
  const handleUpload = async (file: File) => {
    // 处理文件上传
    console.log('上传的文件：', file);
    message.success('上传成功！');
  };
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
          username: props.values.username,
          password: props.values.password,
          usersalt: props.values.userSalt,
          status: props.values.status,
        }}
        title="基本信息"
      >
        <ProForm.Group>
          <ProFormText
            name="username"
            label="用户名"
            rules={[{ required: true, message: '用户名' }]}
          />
          <ProFormText
            name="password"
            label="用户密码"
            rules={[{ required: true, message: '用户密码' }]}
          />
          <ProFormText name="usersalt" label="用户salt" initialValue={'1234'} />
          <ProFormSelect
            name="status"
            label="状态"
            options={statusOptions}
            initialValue={statusOptions[0].value}
          />
        </ProForm.Group>
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          lastLoginDate: props.values.lastLoginDate,
          lastLoginIp: props.values.lastLoginIp,
          memberId: props.values.memberId,
        }}
        title="会员门槛"
      >
        <ProForm.Group title="其他信息">
          <ProFormDateTimePicker name="lastLoginDate" label="登录日期" initialValue={new Date()} />
          <ProFormText name="lastLoginIp" label="登录IP" />
          <ProFormDigit name="memberId" label="会员id" />
        </ProForm.Group>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
