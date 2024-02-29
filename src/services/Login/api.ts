// @ts-ignore
/* eslint-disable */
import { toLogin } from '@/utils/localField';
import { isBlank, menuResourceCode } from '@/utils/utils';
import { request } from '@umijs/max';
import { message } from 'antd';
import { JSEncrypt } from 'jsencrypt';
import defaultSettings from '../../../config/defaultSettings';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/auth/current', {
    method: 'POST',
    ...(options || {}),
  });
}

// 权限
export async function QueryUserRoles() {
  return request(`/user/roles`, {
    method: 'POST',
  });
}
// iconfont
export async function QueryCurrentApplicationIconApi(): Promise<any> {
  return request('/application/icon', {
    method: 'POST',
  });
}
// menus
export async function QueryUserMenuApi() {
  return request(`/user/menus`, {
    method: 'POST',
  });
}

export const RefreshUserDetailApi = async () => {
  try {
    const user = await currentUser();
    if (!user.ok) throw Error('登录失败');
    //获取当前角色
    const role = await QueryUserRoles();
    if (!role.ok) throw Error('角色获取失败');
    //获取当前应用的iconfont配置
    // const applicationIcon = await QueryCurrentApplicationIconApi();

    let resourceArray: string[] = [];
    let menus: any = [];
    // 获取菜单和权限代码
    await QueryUserMenuApi().then((res) => {
      if (res.ok) {
        menus = res.body.menus;
        if (isBlank(menus)) {
          message.error('您的账号未获得此系统权限, 请联系平台处理!');
          throw Error('您的账号未获得此系统权限, 请联系平台处理!');
        }
        resourceArray = ['public', ...res.body.resourceCode, ...menuResourceCode(menus)];
      }
    });
    user.body.avatar =
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    return {
      currentUser: user.body,
      menu: menus,
      resource: resourceArray,
      settings: defaultSettings,
      roles: role.body,
      // iconfontUrl: applicationIcon.body,
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

/** 退出登录接口 POST /api//auth/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
const LOGIN_PUBLIC =
  // eslint-disable-next-line max-len
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeuo9iK3dMU7HhMnL8CcOF1ryHRuOpqOrRyv7G2M3br93vH1GzQkpkCukOSOtoZ+Zq+NJPX5Fzl1EWna+7oYDJokHIMKGHaVvsY/j5BAFdhAZEtSOtBO4kUvUh4yUYtJrdRi9zh4NZ09NSRfAv+BJ5GsRTwq/C/f5TyQeLmPZG1wIDAQAB';

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  const encrypt = new JSEncrypt({});
  encrypt.setPublicKey(LOGIN_PUBLIC);

  const headers = {} as any;

  if (body.password) {
    // eslint-disable-next-line no-param-reassign
    body.password = encrypt.encrypt(body.password);
  }

  if (body.captcha) {
    // eslint-disable-next-line no-param-reassign
    headers.captcha = encrypt.encrypt(body.captcha);
    delete body.captcha;
  }

  headers.clientId = defaultSettings.clientId;

  return request<API.LoginResult>('/auth/authorize', {
    method: 'POST',
    headers,
    data: body,
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
