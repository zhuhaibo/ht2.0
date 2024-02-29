// declare module 'slash2';
// declare module '*.css';
// declare module '*.less';
// declare module '*.scss';
// declare module '*.sass';
// declare module '*.svg';
// declare module '*.png';
// declare module '*.jpg';
// declare module '*.jpeg';
// declare module '*.gif';
// declare module '*.bmp';
// declare module '*.tiff';
// declare module 'omit.js';
// declare module 'numeral';
// declare module '@antv/data-set';
// declare module 'mockjs';
// declare module 'react-fittext';
// declare module 'bizcharts-plugin-slider';
// declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';

declare const BASE_API: string;
declare const SSO_CENTER_URL: string;
declare const SSO_CALLBACK_URL: string;
declare const PREVIEW_URL: string;

// google ReCaptcha
interface ReCaptcha {
  ready: (_: () => void) => void;
  render: (
    container: string | React.ReactNode,
    option: {
      // 网站key
      sitekey: string;
      // 主题 dark light(default)
      theme?: string;
      // 尺寸 compact normal(default)
      size?: 'normal' | 'compact' | 'invisible';
      // tabindex 0(default)
      tabindex?: number;
      callback?: (e: string) => void;
      'expired-callback'?: string;
      'error-callback'?: () => void;
    },
  ) => number;
  // 可选 默认第一个组件
  execute: (widgetId?: number) => Promise<any>;
  getResponse: (widgetId?: number) => string;
  // 可选 默认第一个组件
  reset: (widgetId?: number) => void;
}

interface Window {
  grecaptcha: ReCaptcha;
}

declare const REACT_APP_ENV: 'test' | 'dev' | 'qa' | 'prod' | false;

interface BaseEntity {
  readonly id?: string;
  readonly createdUser?: string;
  readonly createdTime?: string;
  readonly modifiedUser?: string;
  readonly modifiedTime?: string;
}

interface HttpResult<T extends BaseEntity | any> {
  readonly body?: T;
  readonly code: number;
  readonly message: string;
  readonly ok: boolean;
}

interface HttpTableResult<T extends BaseEntity | any> {
  readonly body?: {
    readonly content: T[];
    readonly currentPage: number;
    readonly totalElements: number;
    readonly totalPages: number;
  };
  readonly code: number;
  readonly message: string;
  readonly ok: boolean;
}

interface ResourceDataType {
  name: string;
  code: string;
  sort?: number;
  children?: ResourceDataType[];
}
