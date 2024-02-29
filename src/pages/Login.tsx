import { Footer } from '@/components';
import { login } from '@/services/Login/api';
import { RefreshCaptchaApi } from '@/services/Login/login';
import { setToken } from '@/utils/localField';
import { versionCheck } from '@/utils/utils';
import {
  AliyunOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, Helmet, SelectLang, setLocale, useIntl } from '@umijs/max';
import { Spin, Tabs, message } from 'antd';
import { createStyles } from 'antd-style';
import QueueAnim from 'rc-queue-anim';
import React, { useEffect, useState } from 'react';
import Settings from '../../config/defaultSettings';

const useStyles = createStyles(({ token }) => {
  return {
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const Login: React.FC = () => {
  const intl = useIntl();
  const { styles } = useStyles();
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(true);
  const [captchaImage, setCaptchaImage] = useState<{
    captchaId: string;
    image: string;
  }>();
  const handleSubmit = async (values: API.LoginParams) => {
    const msg = await login({
      ...values,
      loginType: 'account',
      captcha: `${captchaImage?.captchaId},${values.captcha}`,
    });
    if (msg.ok) {
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '登录成功！',
      });
      message.success(defaultLoginSuccessMessage);
      setToken(msg.body!!);
      window.location.href = `${window.location.origin}/`;
    } else {
      refreshCaptcha();
    }
  };
  const refreshCaptcha = () => {
    setCaptchaLoading(true);
    RefreshCaptchaApi()
      .then((res: any) => {
        if (res.ok) {
          setCaptchaImage({
            captchaId: res.body.id,
            image: res.body.image,
          });
        }
      })
      .finally(() => setCaptchaLoading(false));
  };

  useEffect(() => {
    versionCheck();
    const locale = localStorage.getItem('umi_locale');
    setLocale(locale || Settings.locale, false);
    refreshCaptcha();
  }, []);
  return (
    <QueueAnim type={'top'}>
      <div className={styles.container} key="container">
        <Helmet>
          <title>
            {intl.formatMessage({
              id: 'menu.login',
              defaultMessage: '登录页',
            })}
            - {intl.formatMessage({ id: 'title', defaultMessage: `${Settings.title}` })}
          </title>
        </Helmet>
        <Lang />
        <div style={{ flex: '1', padding: '32px 0' }}>
          <LoginForm
            contentStyle={{
              minWidth: 280,
              maxWidth: '75vw',
            }}
            logo={
              // <img src={logo} />
              <AliyunOutlined style={{ fontSize: 48, color: '#1677FF' }} />
            }
            title={
              <div style={{ color: '#1677FF' }}>
                {intl.formatMessage({ id: 'title', defaultMessage: `${Settings.title}` })}
              </div>
            }
            subTitle={Settings.subTitle} // intl.formatMessage({ id: 'pages.layouts.userLayout.title' })
            initialValues={{
              autoLogin: true,
            }}
            onFinish={async (values) => {
              await handleSubmit(values as API.LoginParams);
            }}
            // submitter={{
            //   searchConfig: {
            //     submitText: '登录',
            //   },
            //   submitButtonProps: {
            //     loading: submitting,
            //   },
            // }}
          >
            <Tabs
              activeKey={'account'}
              centered
              items={[
                {
                  key: 'account',
                  label: intl.formatMessage({
                    id: 'pages.login.accountLogin.tab',
                    defaultMessage: '账户密码登录',
                  }),
                },
                // {
                //   key: 'mobile',
                //   disabled: true,
                //   label: intl.formatMessage({
                //     id: 'pages.login.phoneLogin.tab',
                //     defaultMessage: '手机号登录',
                //   }),
                // },
              ]}
            />

            {/* <LoginMessage content="验证码错误" /> */}

            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '用户名: admin or user',
              })}
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
                prefix: <LockOutlined />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '密码: asdasd',
              })}
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

            <ProFormText
              name="captcha"
              fieldProps={{
                size: 'large',
                prefix: <SafetyCertificateOutlined />,
                suffix: [
                  <Spin key="captcha" spinning={captchaLoading}>
                    <img
                      style={{
                        height: 23,
                        cursor: 'pointer',
                        margin: 0,
                      }}
                      src={captchaImage && `data:image/png;base64,${captchaImage?.image}`}
                      onClick={refreshCaptcha}
                      alt=""
                    />
                  </Spin>,
                ],
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.captcha.placeholder',
                defaultMessage: '验证码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.captcha.required"
                      defaultMessage="请输入验证码!"
                    />
                  ),
                },
              ]}
            />

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
    </QueueAnim>
  );
};

export default Login;
