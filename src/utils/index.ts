import { getIntl } from 'umi';
export const parse = (id: any) => getIntl().formatMessage({ id });
export const price = (value) => {
    let reg = /^(-)*(\d+)\.(\d\d).*$/;
    let val = `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(reg, '$1$2.$3');
    if (val == 'undefined') {
      val = '';
    }
    if (val == 'null') {
      val = '';
    }
    return val;
  };