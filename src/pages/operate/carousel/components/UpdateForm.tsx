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
          imgUrl: props.values.imgUrl,
          imgLocationId: props.values.imgLocationId,
          sort: props.values.sort,
          status: props.values.status,
        }}
        title="基本信息"
      >
        <ProFormText
          name="name"
          label="轮播图名称"
          fieldProps={{
            placeholder: '请输入轮播图名称',
          }}
          rules={[{ required: true, message: '轮播图位置id' }]}
        />
        <ProFormText
          name="imgUrl"
          label="轮播图url"
          rules={[
            { required: true, message: '轮播图url' },
            {
              pattern: /^(https|http)?:\/\/[^\s/$.?#].[^\s]*\.(jpg|jpeg|png)$/i,
              message: '图片链接不合法',
            },
          ]}
        />
        <ProFormText
          name="imgLocationId"
          label="轮播图位置id"
          rules={[{ required: true, message: '轮播图位置id' }]}
        />
        <ProFormDigit name="sort" label="排序字段" />
        <ProFormSelect
          name="status"
          label="状态"
          options={statusOptions}
          initialValue={statusOptions[0].value}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
