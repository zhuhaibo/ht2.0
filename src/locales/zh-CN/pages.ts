import productLibrary from './productLibrary';
import system from './system';

export default {
  'pages.layouts.userLayout.title': '弘泰天元科技有限公司',
  'pages.login.accountLogin.tab': '账户密码登录',
  'pages.login.accountLogin.errorMessage': '错误的用户名和密码',
  'pages.login.failure': '登录失败，请重试！',
  'pages.login.success': '登录成功！',
  'pages.login.username.placeholder': '请输入用户名',
  'pages.login.username.required': '用户名是必填项！',
  'pages.login.password.placeholder': '请输入密码',
  'pages.login.password.required': '密码是必填项！',
  'pages.login.phoneLogin.tab': '手机号登录',
  'pages.login.captcha.placeholder': '请输入验证码！',
  'pages.login.captcha.required': '验证码是必填项！',
  'pages.login.rememberMe': '自动登录',
  'pages.login.forgotPassword': '忘记密码 ?',
  'pages.login.submit': '登录',
  'pages.404.subTitle': '抱歉，您访问的页面不存在。',
  'pages.404.buttonText': '返回首页',
  ...productLibrary,
  ...system,
};
