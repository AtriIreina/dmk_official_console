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

// import { articleTypeValueEnum } from '../index';

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
            Modal={props.updateModalVisible}
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
          title: props.values.title,
          articleTypeId: props.values.articleTypeId + '',
          publicDate: props.values.publicDate,
          coverUrl: props.values.coverUrl,
          status: props.values.status,
        }}
        title="基本信息"
      >
        <ProFormText
          name="title"
          label="新闻标题"
          rules={[{ required: true, message: '新闻标题' }]}
        />
        <ProFormSelect
          name="articleTypeId"
          label="新闻类型"
          valueEnum={props.articleTypeValueEnum}
          rules={[{ required: true, message: '新闻类型' }]}
          // initialValue={() => {
          //   // props.articleTypeValueEnum.map((item) => {});
          //   // for (let i in props.articleTypeValueEnum) {
          //   //   // if(props.values.articleTypeId == props.articleTypeValueEnum[i])
          //   //   console.log(i, props.articleTypeValueEnum);
          //   // }
          //   console.log('props.articleTypeValueEnum:', props.articleTypeValueEnum);
          //   return '1..........';
          // }}
        />
        <ProFormDateTimePicker name="publicDate" label="发布日期" initialValue={new Date()} />
        <ProFormText name="coverUrl" label="新闻封面" />
        <ProFormSelect
          name="status"
          label="状态"
          options={statusOptions}
          initialValue={statusOptions[0].value}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          content: props.values.content,
        }}
        title="文章内容"
      >
        <ProFormTextArea name="content" width="lg" />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
