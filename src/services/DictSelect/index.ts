import { request } from 'umi';
export async function DictSearchApi(params: any) {
  return request(`/dict/${params.type}/list`, {
    method: 'POST',
    data: params,
  });
}
