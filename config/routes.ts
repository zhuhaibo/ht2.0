/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
import defaultSettings from './defaultSettings';

export default [
  /**
   * 公共菜单
   * /
   * */
  { path: '/', redirect: defaultSettings.defaultRouter },
  { path: '*', layout: false, component: './404' },
  // 登录
  {
    name: 'login',
    path: '/login',
    component: './Login',
    layout: false,
  },
  /**
   * 接口配置菜单
   * /
   * */
  {
    path: '/welcome',
    name: 'welcome',
    access: 'm:welcome',
    component: './Welcome',
    footerRender: false, // 不展示页脚
  },
  // 商品库管理
  {
    name: 'productlibrary',
    path: '/productlibrary',
    access: 'm:productlibrary',
    routes: [
      { path: '/productlibrary', redirect: '/productlibrary/list' },
      {
        path: 'list',
        name: 'list',
        access: 'm:productlibrary:list',
        component: './ProductLibrary/List',
      },
      {
        path: 'detail/:id',
        title: 'menusDdetail',
        access: 'o:productlibrary:detail',
        component: './ProductLibrary/Detail',
      },
    ]
  },
  // 系统管理
  {
    name: 'system',
    path: '/system',
    access: 'm:setting:system',
    routes: [
      { path: '/system', redirect: '/system/resource' },
      {
        name: 'resource',
        path: 'resource',
        access: 'm:setting:system:resource',
        component: './System/Resource',
      },
      {
        name: 'application',
        path: 'application',
        access: 'm:setting:system:application',
        component: './System/Application',
      },
      {
        name: 'user',
        path: 'user',
        access: 'm:setting:system:user',
        component: './System/User',
      },
      {
        name: 'role',
        path: 'role',
        access: 'm:setting:system:role',
        component: './System/Role',
      },
      {
        name: 'enterprise',
        path: 'enterprise',
        access: 'm:setting:system:enterprise',
        component: './System/Enterprise',
      },
      {
        name: 'dict',
        path: 'dict',
        access: 'm:setting:system:dict',
        component: './System/DictManager',
      },
    ],
  },
];
