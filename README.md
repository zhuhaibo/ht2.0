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

### 配置
`/config/defaultSettings.ts` 

### IconFont 
地址：`iconfont.cn`
账号：`13502060262`


### 国际化
`src/locale`目录下定义语言，文件命名规则：**语言（小写）-国家（大写）.ts**
```js

# 第1步 开启国际化
// /config/defaultSettings.ts
{
  locale:true; // 是否开启国际化
  defaultLanguage: 'zh-CN'; // 默认语言
}

# 第2步 语言切换菜单，增加对应选择项
// /src/layouts/language.tsx
const languageItems: any = [
  { key: 'zh-CN', label: '中文' }, 
  { key: 'en-US', label: 'English' },
  ···
];

# 第3步 创建对应国家语言包文件，在`/src/locale/index.js`导入，并在 `resources` 对象中添加对应配置
// /src/locale/index.js
import enUS from './locales/en-US.json';
import zhCN from './locales/zh-CN.json';
····
resources: {
  'zh-CN': {translation: zhCN},
  'en-US': {translation: enUS},
  ····
},

# 第4步 antd 组件库国际化；antd UI框架自带多语言文件，按需引入即可；
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
