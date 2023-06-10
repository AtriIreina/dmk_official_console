import React, { useState, useEffect } from 'react';
import { Input, message, Image } from 'antd';
import { CodeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { captcha } from '@/services/ant-design-pro/api';
import { useIntl } from 'umi';
import ProForm, { ProFormItem, ProFormText } from '@ant-design/pro-form';

interface CaptchaInputValue {
  codeKey?: string;
  codeValue?: string;
}

interface CaptchaInputProps {
  value?: CaptchaInputValue;
  onChange?: (value: CaptchaInputValue) => void;
}

/**
 * 获取验证码
 */
const getCaptcha = async (values: API.CheckCodeParams) => {
  try {
    //TODO: DO 获取验证码
    //const data = await request(api.captcha);
    const data = await captcha({ ...values });
    // if (data.code === 1) {
    //   return data.data;
    // }
    console.log('getCaptcha:', data.result);
    return data.result;
  } catch (error) {
    message.error('获取验证码失败');
    return [];
  }
  message.error('获取验证码失败');
  return [];
};

const CaptchaInput: React.FC<CaptchaInputProps> = ({ value = {}, onChange }) => {
  const intl = useIntl();
  const [codeValue, setCodeValue] = useState<string>('');
  const [codeKey, setCodeKey] = useState<string>('');
  const [imgBase64, setImgBase64] = useState<string>('');

  // 触发改变
  const triggerChange = (changedValue: { codeValue?: string; codeKey?: string }) => {
    if (onChange) {
      onChange({ codeValue, codeKey, ...value, ...changedValue });
    }
    console.log('triggerChange:', 'codeKey:', codeKey, 'codeValue:', codeValue);
  };

  // 初次访问
  useEffect(() => {
    const checkCodeParams = {
      checkOccasion: 1,
      email: '',
      ipAddr: '',
      param1: '',
      param2: '',
      param3: '',
      phoneNumber: '',
    };
    getCaptcha(checkCodeParams).then((data: any) => {
      setCodeKey(data.codeKey);
      setImgBase64(data.imgBase64);
      triggerChange({ codeKey: data.codeKey, codeValue: codeValue });
      console.log('useEffect:', 'codeKey:', codeKey, 'codeValue:', codeValue);
    });
  }, []);

  // 输入框变化, 设置 cdeValue
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value || '';
    if (code != null && code != '') {
      setCodeValue(code);
    }
    triggerChange({ codeKey: codeKey, codeValue: code });
  };

  // 点击图片
  const onClickImage = () => {
    const checkCodeParams = {
      checkOccasion: 1,
      email: '',
      ipAddr: '',
      param1: '',
      param2: '',
      param3: '',
      phoneNumber: '',
    };
    getCaptcha(checkCodeParams).then((data: any) => {
      setCodeKey(data.codeKey);
      setImgBase64(data.imgBase64);
      triggerChange({ codeKey: data.codeKey, codeValue: codeValue });
    });
  };

  return (
    <span>
      <Input.Group compact>
        <ProFormText
          name="codeValue"
          fieldProps={{
            size: 'large',
            prefix: <CodeOutlined />,
          }}
          placeholder={intl.formatMessage({
            id: 'pages.login.captcha.placeholder',
            defaultMessage: '请输入验证码',
          })}
          width="sm"
          onChange={onChangeInput}
          rules={[
            {
              required: true,
              message: '请输入验证码!',
            },
          ]}
        />
        <img
          style={{
            width: '34%',
            height: '40px',
            verticalAlign: 'middle',
            padding: '0px 0px 0px 5px',
          }}
          // width="sm"
          src={imgBase64}
          onClick={onClickImage}
        />
        <ProFormItem name="codeKey" initialValue={0} />
      </Input.Group>
    </span>
  );
};

export default CaptchaInput;
