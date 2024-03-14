>  项目名称
# 项目名称

### 开发环境启动

```shell
yarn
yarn start
```

### 提交前的代码操作

```shell
yarn lint:fix #代码检查, 不能自动修正的代码需要手动处理
yarn prettier #代码统一格式化
```

### 打包

```shell
yarn
yarn build
```

# 多语言使用

`src/locales`目录下定义语言，规则：**语言-国家.ts**

```js
export default {
  'table.appName': 'AppName',
};
```
