import { request } from '@umijs/max';
export async function QueryResourceListApi(vo: any) {
  return request(`/resource/list`, {
    method: 'POST',
    data: vo,
  });
}

/**
 * 需要调整为正确的实现
 * @param params
 * @constructor
 */
// export async function QuerySelfResourceListApi(params: any) {
//   return request(`/role/${params}/resource`);
// }

export async function SaveOrUpdateResourceApi(params: any) {
  return request('/resource/create', {
    method: 'POST',
    data: params,
  });
}

export async function QueryResourceDetailApi(params: any) {
  return request(`/resource/detail/${params}`);
}

export async function DeleteResourceApi(params: any) {
  return request(`/resource/delete/${params}`, { method: 'POST' });
}
