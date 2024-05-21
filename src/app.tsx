import {
  AvatarDropdown,
  AvatarName,
  Footer,
  Question,
  SelectLang,
  TitleContent,
} from '@/components';
import { RefreshUserDetailApi } from '@/services/Login/api';
import { getToken } from '@/utils/localField';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
// import { SettingDrawer } from '@ant-design/pro-components';
import type { MenuDataItem } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Link, history } from '@umijs/max';
import QueueAnim from 'rc-queue-anim';
import defaultSettings from '../config/defaultSettings';
import layoutBackground from '../public/layout/layoutBackground.png';
import menuBackground from '../public/layout/menuBackground.png';
import globalStyle from './global.less';
import { errorConfig } from './requestErrorConfig';
import { ConfigProvider } from 'antd';


const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    if (!getToken()) {
      history.push(loginPath);
    } else {
      return RefreshUserDetailApi();
    }
  }
  return {
    iconfontUrl: undefined,
    currentUser: undefined,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

/**
 * 菜单渲染
 * @param menu
 */
const menuDataRender = (menu: any[]): MenuDataItem[] => {
  return menu.map((x) => {
    return {
      key: x.id,
      name: x.name,
      icon: x.icon,
      path: x.path ? x.path : '',
      parentKeys: x.parentId ? [x.parentId] : undefined,
      children: x.children ? menuDataRender(x.children) : undefined,
      target: x.target,
    } as MenuDataItem;
  });
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }: any ) => {
  return {
    iconfontUrl: defaultSettings.iconfontUrl,
    menuDataRender: () => menuDataRender(initialState?.menu),
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    //  title
    headerContentRender: () => <TitleContent />,
    // onMenuHeaderClick: () => {}, // logo 点击事件
    collapsedButtonRender: false,
    collapsed: initialState.collapsed,
    onCollapse: (collapsed: boolean) => {
      setInitialState((preInitialState: any) => ({
        ...preInitialState,
        collapsed,
      }));
    },
    headerTitleRender: () => {
      const cspd = !initialState.collapsed;
      return(
        <div style={{ width: cspd ? 257 : 65, transform: 'all 0.5s' }}>
          <QueueAnim style={{ display: 'flex' }} type={cspd ? 'left' : 'right'}>
            <div key="logoDiv" className={globalStyle.logoDiv}>
              <div style={{background: '#1677FF', width: '100%', color: '#fff', fontSize: 20, height: cspd ? 86 : 'auto' }}>
                {cspd ? (
                  <div style={{ margin: '0 18px', borderBottom: '1px solid #73adff' }}>
                  <img src={defaultSettings.logo} alt="" />
                </div>
                ):(
                  <img style={{ height: 30 }} src={defaultSettings.logo} alt="" />
                )}
              </div>
            </div>
          </QueueAnim>
        </div>
      )
      // return !initialState.collapsed ? (
      //   <div style={{ width: 257, transform: 'all 0.5s' }}>
      //     <QueueAnim style={{ display: 'flex' }} type="left">
      //       <div key="logoDiv" className={globalStyle.logoDiv}>
      //         <div style={{background: '#1677FF', width: '100%', color: '#fff', fontSize: 20, height: 86 }}>
      //           <div style={{ margin: '0 18px', borderBottom: '1px solid #73adff' }}>
      //             <img src={defaultSettings.logo} alt="" />
      //           </div>
      //         </div>
      //       </div>
      //     </QueueAnim>
      //   </div>
      // ) : (
      //   <div style={{ width: 65, transform: 'all 0.5s' }}>
      //     <QueueAnim style={{ display: 'flex' }} type="right">
      //       <div key="logoDiv" className={globalStyle.logoDiv}>
      //         <div style={{ background: '#1677FF', width: '100%', color: '#fff', fontSize: 20 }}>
      //           <img style={{ height: 30 }} src={defaultSettings.logo} alt="" />
      //         </div>
      //       </div>
      //     </QueueAnim>
      //   </div>
      // );
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: layoutBackground,
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: layoutBackground,
        bottom: -28,
        right: -45,
        height: '303px',
      },
      {
        src: menuBackground,
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: [
      <div className='menusCollapsedDiv' onClick={()=>{
        setInitialState((preInitialState: any) => ({
          ...preInitialState,
          collapsed: !initialState.collapsed,
        }));


        // setInitialState((preInitialState: any) => ({
        //   ...preInitialState,
        //   collapsed: !initialState.collapsed,
        // }));
        
      }}>
        {initialState.collapsed ? <MenuUnfoldOutlined style={{fontSize: 18, marginLeft: 20}} /> : <MenuFoldOutlined style={{fontSize: 18, marginLeft: 20}} />}
      </div>,
    ],
    menuHeaderRender: () => false,
    // 403
    // unAccessible: <div>unAccessible Error: 403， 您无权访问本页面</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return <ConfigProvider theme={defaultSettings.token}>{children}</ConfigProvider>;
      // return (
      //   <QueueAnim
      //     delay={200}
      //     animConfig={[
      //       { opacity: [1, 0], translateY: [0, 50] },
      //       { opacity: [1, 0], translateY: [0, -50] },
      //     ]}
      //   >
      //     <div key="children">
      //       {children}
      //       {isDev && (
      //         <SettingDrawer
      //           disableUrlParams
      //           enableDarkTheme
      //           settings={initialState?.settings}
      //           onSettingChange={(settings) => {
      //             setInitialState((preInitialState: any) => ({
      //               ...preInitialState,
      //               settings,
      //             }));
      //           }}
      //         />
      //       )}
      //     </div>
      //   </QueueAnim>
      // );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: any = {
  ...errorConfig,
  credentials: 'omit', // 默认请求是否带上cookie
  requestInterceptors: [
    (url: any, options: any) => {
      const lang = localStorage.getItem('umi_locale') || defaultSettings.locale;
      return {
        url: BASE_API + url,
        options: {
          ...options,
          headers: {
            ...options.headers,
            //直接定义语言类型
            'Accept-Language': lang,
            // 登录接口不需要token, 无token会重定向至登录页
            'x-auth-token': url.endsWith('/login') ? '' : getToken(),
            lang,
            // 如果在授权时提供clientId则使用该clientId
            clientId:
              options.headers && options.headers['clientId']
                ? options.headers['clientId']
                : defaultSettings.clientId,
          },
        },
      };
    },
  ],
};
