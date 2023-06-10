import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  CodeOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import ProForm, {
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  LoginForm,
  ProFormItem,
  ProFormGroup,
} from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import CaptchaInput from '../components/CaptchaInput';

import styles from './index.less';

import { getPhoneCaptcha } from '../Login/service';
import { values } from 'lodash';
import type { ProFormInstance } from '@ant-design/pro-components';
import { useUpdateEffect } from 'ahooks';

import { currentUser } from '@/services/ant-design-pro/api';

import { removeItem } from '@/utils/localStorageUtil';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const [form] = ProForm.useForm();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    console.log('handleSubmit:', values);
    try {
      console.log('values:', values);
      // TODO:登录 (取消图形验证码)
      // if (values.checkCodeDto?.codeKey == '' || values.checkCodeDto?.codeKey == null) {
      //   message.error('验证码无效, 请刷新验证码');
      //   return;
      // }
      // if (values.checkCodeDto?.codeValue == '' || values.checkCodeDto?.codeValue == null) {
      //   message.error('请输入验证码');
      //   return;
      // }
      const msg = await login({ ...values, type });
      console.log('msg:', msg);
      if (msg != null) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        console.log('login', history, redirect);
        return;
      } else {
        message.error('用户信息错误');
        formRef.current?.reload();
        console.log('reload');
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg.msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status, type: loginType } = userLoginState;

  //TODO:如果已登录,跳转
  useEffect(() => {
    //来到登陆页面时,直接退出用户
    removeItem('user');
    removeItem('token');
    // const fetchData = async () => {
    //   const result = await currentUser();
    //   console.log('login-fetch:', result);
    //   if (result != null && result != undefined) {
    //     window.location.replace('/');
    //     return;
    //   }
    // };
    // fetchData();
  }, []);

  return (
    <div className={styles.container}>
      {/* <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div> */}
      <div className={styles.content}>
        <LoginForm
          autoFocusFirstInput={true}
          logo={<img alt="logo" src="/logo.svg" />}
          title="到门口官网后台系统"
          // subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          subTitle={'现在时间: ' + new Date().toLocaleTimeString()}
          initialValues={{
            autoLogin: true,
          }}
          formRef={formRef}
          actions={[
            <FormattedMessage
              key="loginWith"
              id="pages.login.loginWith"
              defaultMessage="其他登录方式"
            />,
            <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
            <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
            <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
          ]}
          form={form}
          onFinish={async (values) => {
            console.log('LoginForm-onFinish-values:', form.getFieldsValue());
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {/* TODO: 选择登录方式 */}
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              })}
            />
            <Tabs.TabPane
              key="mobile"
              tab={intl.formatMessage({
                id: 'pages.login.phoneLogin.tab',
                defaultMessage: '手机号登录',
              })}
            />
          </Tabs>
          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              {/* TODO: DO 登陆界面 */}
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入用户名"
                // placeholder={intl.formatMessage({
                //   id: 'pages.login.username.placeholder',
                //   defaultMessage: '用户名: admin or user',
                // })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入用户密码"
                // placeholder={intl.formatMessage({
                //   id: 'pages.login.password.placeholder',
                //   defaultMessage: '密码: ant.design / admin1234',
                // })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormItem name="checkCodeDto">
                <CaptchaInput />
              </ProFormItem>
            </>
          )}
          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="phone"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async () => {
                  const result = await getPhoneCaptcha(form.getFieldsValue().phone);
                  if (result.successful == 'true') {
                    message.success('验证码获取成功, 请及时填写');
                  } else {
                    message.success(result.msg);
                  }
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
