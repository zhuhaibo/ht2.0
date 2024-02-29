import { request } from '@umijs/max';

export async function QueryCommodityStandardList(params: any) {
  return request(`/commodity_standard/list`, {
    method: 'POST',
    data: params,
  });
}

export async function QueryCommodityKzUpdate(params: any) {
  return request(`/commodity_standard/commodity_kz_update`, {
    method: 'POST',
    data: params,
  });
}
