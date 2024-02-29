// noinspection ExceptionCaughtLocallyJS

import { toLogin } from '@/utils/localField';
import { isBlank, menuResourceCode } from '@/utils/utils';
import { notification } from 'antd';
import { JSEncrypt } from 'jsencrypt';
import { stringify } from 'qs';
import { request } from 'umi';
import defaultSettings from '../../../config/defaultSettings';

const prefix = '/user';

const LOGIN_PUBLIC =
  // eslint-disable-next-line max-len
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeuo9iK3dMU7HhMnL8CcOF1ryHRuOpqOrRyv7G2M3br93vH1GzQkpkCukOSOtoZ+Zq+NJPX5Fzl1EWna+7oYDJokHIMKGHaVvsY/j5BAFdhAZEtSOtBO4kUvUh4yUYtJrdRi9zh4NZ09NSRfAv+BJ5GsRTwq/C/f5TyQeLmPZG1wIDAQAB';

export async function QueryCurrentUserApi() {
  return request('/auth/current', {
    method: 'POST',
  });
}

export async function UserLoginApi(params: any, queryParam: any) {
  const headers = {} as any;
  const encrypt = new JSEncrypt({});
  encrypt.setPublicKey(LOGIN_PUBLIC);

  if (queryParam.clientId && queryParam.callback) {
    headers.clientId = queryParam.clientId;
    headers.callback = queryParam.callback;
  } else {
    headers.clientId = defaultSettings.clientId;
  }

  if (params.password) {
    // eslint-disable-next-line no-param-reassign
    params.password = encrypt.encrypt(params.password);
  }

  if (params.captcha) {
    // eslint-disable-next-line no-param-reassign
    headers.captcha = encrypt.encrypt(params.captcha);
    delete params.captcha;
  }

  return request('/auth/authorize', {
    method: 'POST',
    data: params,
    headers,
  });
}

export async function RefreshCaptchaApi() {
  return request(`/auth/captcha`, {
    method: 'POST',
  });
}

export async function UserLogoutApi() {
  return request(`/auth/logout`, {
    method: 'POST',
    data: {},
  });
}

export async function passwordVerifyMessage(params: any) {
  const headers = {} as any;
  const encrypt = new JSEncrypt({});
  encrypt.setPublicKey(LOGIN_PUBLIC);
  if (params.captcha) {
    // eslint-disable-next-line no-param-reassign
    headers.captcha = encrypt.encrypt(params.captcha);
    delete params.captcha;
  }
  if (params.username) {
    // eslint-disable-next-line no-param-reassign
    headers.userName = params.username;
    delete params.username;
  }
  return request(`/auth/passwordVerifyMessage`, {
    method: 'POST',
    data: params,
    headers,
  });
}

export async function passwordModify(params: any) {
  return request(`/auth/passwordModify`, {
    method: 'POST',
    data: params,
  });
}

export async function QueryUserListApi(params: any) {
  return request(`${prefix}/list`, {
    method: 'POST',
    data: params,
  });
}

export async function QueryUserMenuApi() {
  return request(`${prefix}/menus`, {
    method: 'POST',
  });
}

export async function QueryUserRoles() {
  return request(`${prefix}/roles`, {
    method: 'POST',
  });
}

export async function DeleteUserApi(params: any) {
  return request(`${prefix}/delete`, {
    method: 'POST',
    data: params,
  });
}

export async function QueryUserDetailApi(params: any) {
  return request(`${prefix}/detail/${params}`);
}

export async function QueryCurrentRoleApi(params: any) {
  return request(`${prefix}/${params}/role`);
}

export async function SaveOrUpdateUserApi(params: any) {
  return request(`${prefix}/create`, {
    method: 'POST',
    data: params,
  });
}

export async function UpdateSelfInfoApi(params: any) {
  return request(`${prefix}/updateSelfInfo`, {
    method: 'POST',
    data: params,
  });
}

export async function ColumnValidCheckApi(params: any) {
  return request(`${prefix}/columnValidCheck`, {
    method: 'POST',
    data: params,
  });
}

export async function ModifyPasswordApi(params: any) {
  return request(`${prefix}/password/modify`, {
    method: 'POST',
    data: params,
  });
}

export async function LockUserApi(params: any) {
  return request(`${prefix}/lock`, {
    method: 'POST',
    data: params,
  });
}

export async function ResetPasswordApi(params: any) {
  return request(`${prefix}/password/reset`, {
    method: 'POST',
    data: params,
  });
}

export async function EmailValidCheckApi(params: any) {
  return request(`${prefix}/emailValidCheck?${stringify(params)}`);
}

export async function ModifyEmailApi(params: any) {
  return request(`${prefix}/updateEmail?${stringify(params)}`);
}

export async function TelephoneValidCheckApi(params: any) {
  return request(`${prefix}/telephoneValidCheck?${stringify(params)}`);
}

export async function ModifyTelephoneApi(params: any) {
  return request(`${prefix}/updateTelephone?${stringify(params)}`);
}

export async function SendEmailValidCodeApi(params: any) {
  return request(`/verify/sendEmailValidCode?${stringify(params)}`);
}

export async function checkNewEmailValidCodeApi(params: any) {
  return request(`${prefix}/checkNewEmail?${stringify(params)}`);
}

export async function QueryCurrentApplicationIconApi(): Promise<HttpResult<string>> {
  return request('/application/icon', {
    method: 'POST',
  });
}

export const RefreshUserDetailApi = async () => {
  try {
    const user = await QueryCurrentUserApi();
    if (!user.ok) throw Error('登录失败');
    //获取当前角色
    const role = await QueryUserRoles();
    if (!role.ok) throw Error('角色获取失败');
    //获取当前应用的iconfont配置
    const applicationIcon = await QueryCurrentApplicationIconApi();

    let resourceArray: string[] = [];
    let menus: any = [];
    // 获取菜单和权限代码
    await QueryUserMenuApi().then((res) => {
      if (res.ok) {
        menus = res.body.menus;
        if (isBlank(menus)) {
          notification.error({
            message: '您的账号未获得此系统权限, 请联系平台处理!',
          });
          throw Error('您的账号未获得此系统权限, 请联系平台处理!');
        }
        resourceArray = ['public', ...res.body.resourceCode, ...menuResourceCode(menus)];
      }
    });

    return {
      currentUser: user.body,
      menu: menus,
      resource: resourceArray,
      settings: defaultSettings,
      roles: role.body,
      iconfontUrl: applicationIcon.body,
    };
  } catch (error) {
    toLogin();
  }
  return {
    currentUser: undefined,
    settings: defaultSettings,
    resource: [],
    menu: [],
    roles: [],
    iconfontUrl: undefined,
  };
};
