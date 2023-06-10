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
import StepForm from '@/pages/form/step-form';

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

//TODO: 5.修改分步表单
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
          level: props.values.level,
          name: props.values.name,
          franchiseFee: props.values.franchiseFee,
          status: props.values.status,
        }}
        title="基本信息"
      >
        <ProFormDigit
          name="level"
          label="代理级别"
          rules={[{ required: true, message: '代理级别' }]}
        />
        <ProFormText
          name="name"
          label="级别名称"
          rules={[{ required: true, message: '级别名称' }]}
        />
        <ProFormDigit name="franchiseFee" label="加盟费(万元)" />
        <ProFormText name="icon" label="代理级别图标" />
        <ProFormSelect
          name="status"
          label="状态"
          options={statusOptions}
          initialValue={statusOptions[0].value}
        />
      </StepsForm.StepForm>

      <StepsForm.StepForm
        initialValues={{
          bonusPoints: props.values.bonusPoints,
          productSubsidies: props.values.productSubsidies,
          transactionAllowance: props.values.transactionAllowance,
          shoppingAllowance: props.values.shoppingAllowance,
          isSupportDividends: props.values.isSupportDividends,
        }}
        title="基本信息"
      >
        <ProFormDigit name="bonusPoints" label="积分赠送" />
        <ProFormDigit name="productSubsidies" label="上架补贴" />
        <ProFormDigit name="transactionAllowance" label="成交补贴" />
        <ProFormDigit name="shoppingAllowance" label="购物补贴" />
        <ProFormSelect
          name="isSupportDividends"
          label="是否每月分红"
          options={[
            { label: '每月分红', value: 1 },
            { label: '不分红', value: 0 },
          ]}
          initialValue={0}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        title="互助信息"
        initialValues={{
          rehabilitationCare: props.values.rehabilitationCare,
          travelCare: props.values.travelCare,
          illnessCare: props.values.illnessCare,
          accidentCare: props.values.accidentCare,
          healthyCare: props.values.healthyCare,
          happyCare: props.values.happyCare,
        }}
      >
        <ProFormDigit name="rehabilitationCare" label="康养互助" />
        <ProFormDigit name="travelCare" label="旅游互助" />
        <ProFormDigit name="illnessCare" label="大病互助" />
        <ProFormDigit name="accidentCare" label="意外互助" />
        <ProFormDigit name="healthyCare" label="健康互助" />
        <ProFormDigit name="happyCare" label="喜事津贴" />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
