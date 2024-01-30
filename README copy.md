# Umi4.0 / Ant-design5.0 / Nodejs 20.5.0

### 开发环境启动

```shell
yarn
yarn start
```

### 打包

```shell
yarn install
yarn build
```

### 站点相关配置
/src/ConfigSystemSettings/index.ts

# 多语言使用
`src/locale`目录下定义语言，规则：**语言-国家.ts**
```js

1. 国际化相关
// /src/ConfigSystemSettings/index 
export const locale = true; // 是否开启国际化
export const defaultLanguage = 'zh-CN'; // 默认语言

2. topbar 多语言切换组件
// /src/layouts/language.tsx
const languageItems: any = [ 
  { key: 'zh-CN', label: '中文' }, 
  { key: 'en-US', label: 'English' },
];

3. 项目语言包
// /src/locale
import enUS from './locales/en-US.json';
import zhCN from './locales/zh-CN.json';
resources: {
  'zh-CN': {translation: zhCN},
  'en-US': {translation: enUS},
},

4. antd 组件库国际化
// /src/layouts/index
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
const localeArr: any = {
  "zh-CN": zhCN,
  "en-US": enUS,
}

```
