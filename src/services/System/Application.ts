import { request } from 'umi';

export async function QueryApplicationListApi(params: any) {
  return request('/application/list', {
    method: 'POST',
    data: params,
  });
}

// export async function SaveOrUpdateRoleApi(params: any) {
//   return request(`/role/modify`, {
//     method: 'POST',
//     data: params,
//   });
// }

// export async function DeleteRoleApi(params: any) {
//   return request('/role/delete', {
//     method: 'POST',
//     data: params,
//   });
// }
