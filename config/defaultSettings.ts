/**
 * @name
 */
const Settings = {
  version: '1.0.0',
  // 站点标题
  title: '哈萨克斯坦跨境电商监管系统',
  // 副标题
  subTitle: 'Transnational railway digital document service platform',
  // 应用名称
  clientId: 'manager',
  // 默认访问的路由页面
  defaultRouter: '/productlibrary/list',
  logo: '/logo.jpg',
  // 图标库
  iconfontUrl: '//at.alicdn.com/t/c/font_3982504_o23kmcb652p.js',
  // 国际化
  locale: 'zh-CN',
  navTheme: 'light',
  colorPrimary: '#1677FF',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  pwa: true,
  token: {
    header: {
      colorBgHeader: '#fff',
      heightLayoutHeader: 80,
    },
    components: {
      Table: {
        headerBg: '#1677ff',
        headerSplitColor: '#1677ff',
        headerColor: '#fff',
        headerBorderRadius: 0,
        cellPaddingBlockSM: 8,
        cellPaddingInlineSM: 8,
        cellPaddingBlockMD: 8,
        cellPaddingInlineMD: 8,
        cellPaddingBlockLG: 8,
        cellPaddingInlineLG: 8,
      },
    },
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
  footerRender: false,
};

export default Settings;
