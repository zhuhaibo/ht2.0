# 开发环境相关
```shell
Nodejs 20 / React 18 / Umi 4 / Ant-design 5 

```


### 开发环境启动

```shell
yarn
yarn start
```

### 打包

```shell
yarn install && yarn build
```

### 站点相关配置
/src/ConfigSystemSettings/index.ts

### 国际化 (4个地方需要配置)
`src/locale`目录下定义语言，规则：**语言-国家.ts**
```js

1. 国际化相关
// /src/ConfigSystemSettings/index.ts
export const locale = true; // 是否开启国际化
export const defaultLanguage = 'zh-CN'; // 默认语言

2. topbar select 多语言切换增加对应选择项
// /src/layouts/language.tsx
const languageItems: any = [ 
  { key: 'zh-CN', label: '中文' }, 
  { key: 'en-US', label: 'English' },
  ···
];

3. 创建对应国家语言包文件，在index.js导入，并在resources对象中添加对应配置
// /src/locale/index.js
import enUS from './locales/en-US.json';
import zhCN from './locales/zh-CN.json';
····
resources: {
  'zh-CN': {translation: zhCN},
  'en-US': {translation: enUS},
  ····
},

4. antd 组件库国际化；antd UI框架自带多语言文件，按需引入即可；
// /src/layouts/index.tsx
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
····
const localeArr: any = {
  "zh-CN": zhCN,
  "en-US": enUS,
  ····
}

```
