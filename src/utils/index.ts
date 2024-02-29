import { getIntl } from 'umi';
export const parse = (id: any) => getIntl().formatMessage({ id });
