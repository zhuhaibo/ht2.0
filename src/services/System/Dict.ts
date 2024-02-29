import { request } from 'umi';

export async function DictRemoveApi(params: any) {
  return request('/dict/delete', {
    method: 'POST',
    data: params,
  });
}

export async function DictSaveOrUpdateApi(params: any) {
  return request('/dict/saveOrUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function DictTypOrContentListApi(params: any) {
  return request('/dict/list', {
    method: 'POST',
    data: params,
  });
}

export async function DictCheckApi(params: any) {
  return request('/dict/check', {
    method: 'POST',
    data: params,
  });
}

export async function QueryDictCountry(params: any) {
  return request(`/dict/byCode`, {
    method: 'POST',
    data: params,
  });
}
