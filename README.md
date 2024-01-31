# 开发环境相关
```shell
Nodejs 20 / React 18 / Umi 4 / Ant-design 5 

```


### 启动

```shell
yarn
yarn start
```

### 打包

```shell
yarn install && yarn build
```

### 更多站点相关配置
`/src/ConfigSystemSettings/index.ts` Logo、水印、初始页，国际化 等等

#### iconfont `iconfont.cn``账号：13502060262`





### 国际化 (4个地方需要配置)
`src/locale`目录下定义语言，规则：**语言-国家.ts**
```js

1. 开启国际化
// /src/ConfigSystemSettings/index.ts
export const locale = true; // 是否开启国际化
export const defaultLanguage = 'zh-CN'; // 默认语言

2. 语言切换菜单，增加对应选择项
// /src/layouts/language.tsx
const languageItems: any = [ 
  { key: 'zh-CN', label: '中文' }, 
  { key: 'en-US', label: 'English' },
  ···
];

3. 创建对应国家语言包文件，在`/src/locale/index.js`导入，并在 `resources` 对象中添加对应配置
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
