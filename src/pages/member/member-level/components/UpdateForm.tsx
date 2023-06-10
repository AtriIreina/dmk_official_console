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
} from '@ant-design/pro-form';
import type { TableListItem } from '../data';
import {
  setItemWithExpiration as setStorage,
  getItemWithExpiration as getStorage,
  removeItem,
  getItemWithExpiration,
} from '../../../../utils/localStorageUtil';
import { values } from 'lodash';

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
      onFinish={() => {
        console.log('props:', props.values);
        //TODO:这里强制执行,居然可以提交最新的图片
        props.onSubmit();
      }}
    >
      <StepsForm.StepForm
        initialValues={{
          name: props.values.name,
          level: props.values.level,
          periodDays: props.values.periodDays,
          icon: props.values.icon,
          status: props.values.status,
        }}
        title="基本信息"
      >
        <ProForm.Group>
          <ProFormText
            name="name"
            label="会员级别名称"
            rules={[{ required: true, message: '会员级别名称' }]}
          />
          <ProFormDigit
            name="level"
            label="会员级别等级"
            rules={[{ required: true, message: '会员级别名称' }]}
          />
          <ProFormDigit name="periodDays" label="有效期(天)" initialValue={30} />
          <ProFormItem hidden name="icon2" label="会员级别图标">
            {/* TODO: WAIT DO 图片上传 */}
            <Radio.Group onChange={(e) => setUploadMethod(e.target.value)} value={uploadMethod}>
              <Radio value="upload">上传图片</Radio>
              {/* <Radio value="drag">拖拽上传</Radio> */}
              <Radio value="url">输入链接</Radio>
            </Radio.Group>
            {uploadMethod === 'upload' && (
              <ProFormUploadButton
                //这个是修改表单的字段
                name="icon1"
                max={1}
                fieldProps={{
                  accept: '.png,.jpg,.jpeg',
                  multiple: true,
                  //这个是上传图片的 后台参数名
                  name: 'filedata',
                  headers: { Authorization: 'bearer ' + getStorage('token') },
                  onChange(info) {
                    const file = info.file;
                    const status = info.file.status;
                    if (status === 'done') {
                      // 完成
                      message.success('图片上传成功...');
                      const res = file.response.data; // 上传后台返回的结果
                      // console.log(info);

                      const url = info.file.response.data.url;
                      console.log(url);
                      props.values.icon = url;
                      console.log('url:', url);
                      console.log('props.values.icon:', props.values.icon);
                    } else if (status === 'error') {
                      // 错误
                      message.error(`${info.file.name} 文件上传失败`);
                    }
                  },
                }}
                action="/api/content/upload/image"
                // action = async function upload(params:type) {

                // }

                // action={async () => ({
                //   data: currentRow || {},
                // })}
              />
            )}
            {/* {uploadMethod === 'drag' && (
              <ProFormUploadDragger
                name="filedata"
                fieldProps={{
                  accept: '.png,.jpg,.jpeg',
                  multiple: true,
                  //这个是上传图片的 后台参数名
                  name: 'filedata',
                  headers: { Authorization: 'bearer ' + getStorage('token') },
                }}
                onChange={(fileList) => handleUpload(fileList[0]?.originFileObj)}
              />
            )} */}
            {uploadMethod === 'url' && (
              <ProFormText
                name="icon2"
                fieldProps={{
                  placeholder: '请输入图片链接',
                }}
                rules={[
                  {
                    pattern: /^(https?:\/\/)?[\w\-./]*\.(png|jpg|jpeg)$/,
                    message: '请输入合法的图片链接',
                  },
                ]}
              />
            )}
          </ProFormItem>

          <ProFormText name="icon" label="会员级别图标" />

          <ProFormSelect
            name="status"
            label="状态"
            width={'xs'}
            options={statusOptions}
            initialValue={statusOptions[0].value}
          />
        </ProForm.Group>
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          pointsThreshold: props.values.pointsThreshold,
          consumeThreshold: props.values.consumeThreshold,
        }}
        title="会员门槛"
      >
        <ProForm.Group>
          <ProFormDigit name="pointsThreshold" label="积分阈值" initialValue={0} />
          <ProFormDigit name="consumeThreshold" label="消费阈值" initialValue={0} />
        </ProForm.Group>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
