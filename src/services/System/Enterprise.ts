import { request } from 'umi';

export async function QueryEnterpriseListApi(params: any) {
  return request('/enterprise/list', {
    method: 'POST',
    data: params,
  });
}

export async function SaveOrUpdateEnterpriseApi(params: any) {
  return request('/enterprise/create', {
    method: 'POST',
    data: params,
  });
}

export async function QueryEnterpriseDetailApi(params: any) {
  return request(`/enterprise/detail/${params}`);
}

export async function DeleteEnterpriseApi(params: any) {
  return request(`/enterprise/delete/${params}`);
}
