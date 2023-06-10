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

const supportStatus = [
  { label: '支持', value: 1 },
  { label: '不支持', value: 0 },
];

const freeStatus = [
  { label: '免费', value: 1 },
  { label: '付费', value: 0 },
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
          settlePrice: props.values.settlePrice,
          icon: props.values.icon,
          shopCount: props.values.shopCount,
          imageSpaceCapacity: props.values.imageSpaceCapacity,
          isGiveOneDomain: props.values.isGiveOneDomain,
          isLimitStyleCount: props.values.isLimitStyleCount,
          isLimitProductCount: props.values.isLimitProductCount,
          status: props.values.status,
        }}
        title="基本信息"
      >
        <ProForm.Group>
          <ProFormDigit
            name="level"
            label="商户级别"
            rules={[{ required: true, message: '商户级别' }]}
          />
          <ProFormText
            name="name"
            label="商户名称"
            rules={[{ required: true, message: '商户名称' }]}
          />
          <ProFormDigit name="settlePrice" label="入驻费用(万元)" />
          <ProFormText name="icon" label="商户级别图标" />
          <ProFormDigit name="shopCount" label="分店数量限制" />
          <ProFormDigit name="imageSpaceCapacity" label="图片空间容量(MB)" />
          <ProFormSelect
            name="isGiveOneDomain"
            label="是否赠送一级域名"
            options={[
              { label: '赠送', value: 1 },
              { label: '不赠送', value: 0 },
            ]}
            initialValue={statusOptions[1].value}
          />
          <ProFormSelect
            name="isLimitStyleCount"
            label="是否限制风格"
            options={[
              { label: '限制', value: 1 },
              { label: '不限制', value: 0 },
            ]}
            initialValue={statusOptions[0].value}
          />
          <ProFormSelect
            name="isLimitProductCount"
            label="是否限制产品数量"
            options={[
              { label: '限制', value: 1 },
              { label: '不限制', value: 0 },
            ]}
            initialValue={statusOptions[0].value}
          />
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
          isSupportTwoDomain: props.values.isSupportTwoDomain,
          isShopRecommend: props.values.isShopRecommend,
          isSupportBasic: props.values.isSupportBasic,
          isSupportTraining: props.values.isSupportTraining,
          isSupportOnlineService: props.values.isSupportOnlineService,
          isSupportMapLabel: props.values.isSupportMapLabel,
          isSupportReviseLogo: props.values.isSupportReviseLogo,
          isSupportReviseSign: props.values.isSupportReviseSign,
          isSupportSlideshow: props.values.isSupportSlideshow,
        }}
        title="基本信息"
      >
        <ProForm.Group title="支持信息">
          <ProFormSelect
            name="isSupportTwoDomain"
            label="是否支持二级域名"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isShopRecommend"
            label="支持产品推荐"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportBasic"
            label="支持基本功能"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportTraining"
            label="支持上门培训"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportOnlineService"
            label="支持在线客服"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportMapLabel"
            label="支持地图标注"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportReviseLogo"
            label="支持修改logo"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportReviseSign"
            label="支持修改招牌"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportSlideshow"
            label="支持幻灯片广告"
            options={supportStatus}
            initialValue={1}
          />
        </ProForm.Group>
      </StepsForm.StepForm>

      <StepsForm.StepForm
        title="互助信息"
        initialValues={{
          isFreeCertified: props.values.isFreeCertified,
          isFreePromotion: props.values.isFreePromotion,
          isFreeMobileShop: props.values.isFreeMobileShop,
          isFreeWechatWebsite: props.values.isFreeWechatWebsite,
          isFreeOnebyoneService: props.values.isFreeOnebyoneService,
        }}
      >
        <ProForm.Group>
          <ProFormSelect
            name="isFreeCertified"
            label="免费实地认证"
            options={freeStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isFreePromotion"
            label="免费促销"
            options={freeStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isFreeMobileShop"
            label="免费手机店铺"
            options={freeStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isFreeWechatWebsite"
            label="免费微信网站"
            options={freeStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isFreeOnebyoneService"
            label="免费1对1服务"
            options={freeStatus}
            initialValue={1}
          />
        </ProForm.Group>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
