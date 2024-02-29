import { request } from 'umi';

export async function QueryRoleListApi(params: any) {
  return request('/role/list', {
    method: 'POST',
    data: params,
  });
}

export async function SaveOrUpdateRoleApi(params: any) {
  return request(`/role/modify`, {
    method: 'POST',
    data: params,
  });
}

export async function QueryRoleDetailApi(params: any) {
  return request(`/role/detail/${params}`);
}

export async function QueryRoleResourceListApi(params: any) {
  return request(`/role/${params}/resource`);
}

export async function DeleteRoleApi(params: any) {
  return request('/role/delete', {
    method: 'POST',
    data: params,
  });
}

export async function ModifyRoleResourceApi(params: any) {
  return request('/role/modify/resource', {
    method: 'POST',
    data: params,
  });
}

export async function UserGrantRoleApi(params: any) {
  return request('/user/grant', {
    method: 'POST',
    data: params,
  });
}
