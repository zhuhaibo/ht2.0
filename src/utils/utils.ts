import { notification } from 'antd';
import moment from 'moment';
import defaultSettings from '../../config/defaultSettings';

export const isBlank = (obj?: any) =>
  obj === null ||
  obj === undefined ||
  obj === '' ||
  (Array.isArray(obj) && obj.length === 0) ||
  (typeof obj === 'object' && Object.keys(obj).length === 0);

/**
 * 收集menu权限代码
 * @param menu
 */
export const menuResourceCode = (menu: any[]): string[] => {
  const code: string[] = [];
  menu.forEach((x) => {
    if (x.children) {
      code.push(...menuResourceCode(x.children));
    }
    code.push(x.code);
  });
  return code;
};

// @ts-ignore
export const emptyOrDefault = (obj?: any, defaultValue: any) => (isBlank(obj) ? defaultValue : obj);

export const emptyFormat = (obj?: any) => (isBlank(obj) ? '--' : obj);

export const emptyFormatNumber = (obj?: string | number, precision: number = 0) =>
  isBlank(obj) ? '--' : Number(obj).toFixed(precision);

// eslint-disable-next-line no-nested-ternary
export const emptyFormatBoolean = (obj?: string | number) =>
  isBlank(obj) ? '--' : obj === 0 || obj === '0' ? '否' : '是';

export const emptyFormatEmptyString = (obj?: any) => (isBlank(obj) ? '' : obj);

export const emptyFormatDate = (obj?: string, isEmpty?: any) => {
  return isBlank(obj) ? (isEmpty == '' ? '' : '--') : moment(obj).format('YYYY-MM-DD');
};

export const emptyFormatDates = (obj?: string) =>
  isBlank(obj) ? '--' : moment(obj).format('DD/MM/YYYY');

export const emptyFormatDatesTime = (obj?: string) =>
  isBlank(obj) || obj == '--' ? '--' : moment(obj).format('DD/MM/YYYY HH:mm:ss');

export const emptyFormatDateTime = (obj?: string) =>
  isBlank(obj) || obj == '--' ? '--' : moment(obj).format('YYYY-MM-DD HH:mm:ss');

export const formatDataTimeReg = (obj?: string, reg?: string) =>
  isBlank(obj) || obj == '--' ? '--' : moment(obj).format(reg);

/**
 * 将HTTPTableResult转换为ProTable使用的RequestData
 * @param httpTableResult
 */
export const httpTableResultToRequestData = <T>(httpTableResult: any): any => {
  if (!httpTableResult.ok) notification.error({ message: httpTableResult.message });
  return {
    data: httpTableResult.body?.content || [],
    success: httpTableResult.ok,
    total: httpTableResult.body?.totalElements || 0,
  };
};

/**
 * 将HTTPResult转换为ProTable使用的RequestData
 * @param httpResult
 */
export const httpResultToRequestData = <T>(httpResult: any): any => {
  if (!httpResult.ok) notification.error({ message: httpResult.message });
  return {
    data: httpResult.body || [],
    success: httpResult.ok,
    total: 0,
  };
};

/**
 * 将ProTable请求时的分页参数转换为当前系统分页参数
 * @param params
 */
export const queryPageableConvert = (params: any) => {
  const localParams = params;
  let page;
  let size;
  if (localParams?.current) {
    page = localParams?.current;
    delete localParams?.current;
  }
  if (localParams?.pageSize) {
    size = localParams?.pageSize;
    delete localParams?.pageSize;
  }
  return {
    ...localParams,
    page,
    size,
  };
};

/**
 * 将指定属性格式化为范围日期
 * 搭配antd的dateRange组件使用
 * @param data
 * @param fieldsName 该字段必须是通过dateRange取值的 其为一个moment类型长度为2的数组
 */
export const formatToDateRange = (data: any, ...fieldsName: string[]): any => {
  const dateValue = { ...data };
  fieldsName.forEach((x) => {
    if (!isBlank(dateValue[x])) {
      dateValue[`${x}Start`] = moment(dateValue[x][0]).format('YYYY-MM-DD');
      dateValue[`${x}End`] = moment(dateValue[x][1]).add(1, 'day').format('YYYY-MM-DD');
      delete dateValue[x];
    }
  });
  return dateValue;
};

/**
 * 将code/name形式的字典值转为Form可回显的格式
 * @param data
 * @param fieldsName
 */
export const codeAndNameToDictValue = (data: any, ...fieldsName: string[]): any => {
  const dictValue = { ...data };
  fieldsName.forEach((x) => {
    if (dictValue[`${x}Code`] && dictValue[`${x}Name`]) {
      dictValue[x] = {
        value: dictValue[`${x}Code`],
        key: dictValue[`${x}Code`],
        label: dictValue[`${x}Name`],
      };
      delete dictValue[`${x}Code`];
      delete dictValue[`${x}Name`];
    }
  });
  return dictValue;
};
/**
 * 将指定字段转换为moment类型
 * @param data
 * @param fieldsName
 */
export const convertToMoment = (data: any, ...fieldsName: string[]): any => {
  const dateValue = { ...data };
  fieldsName.forEach((x) => {
    if (!isBlank(dateValue[x])) {
      dateValue[x] = moment(dateValue[x]);
    }
  });
  return dateValue;
};
// 计算序号
export function calculateListNum<T>(
  payload: HttpTableResult<T>,
  pageSize: number = 15,
): HttpTableResult<T> {
  const { content, currentPage } = payload.body!!;
  const data = Object.values([...content]).map((x: T, i) => {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    x.num = i + 1 + (currentPage * pageSize - pageSize);
    return x;
  });
  return {
    ...payload,
    // @ts-ignore
    body: {
      content: data,
      totalElements: payload.body?.totalElements || 0,
    },
  };
}

export const versionCheck = () => {
  const version = localStorage.getItem('version');
  if (version !== defaultSettings.version) {
    localStorage.clear();
    localStorage.setItem('version', defaultSettings.version);
  }
};
