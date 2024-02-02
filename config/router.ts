import initialState from './defaultSettings';
export default [
    // 登录页
    { path: "/login", component: "@/pages/login", layout: false },
    { path: '/', redirect: initialState.initPath },
    { path: '/*', component: '404' },
    { path: '/welcome', access: "m:welcome", name:'welcome', component: '@/pages/welcome' },
    { path: '/home', component: '@/pages/home', access: "m:home", name:'home' },
    { path: '/dataView', component: '@/pages/dataView', access: "m:dataView", name:'dataView' },
    { 
      path: "/documentation", 
      access: "m:documentation",
      routes: [
        { path: "intermodal", component: "@/pages/documentation/intermodal", access: "m:documentation:intermodal" },
        {
          name: 'intermodalDetail',
          path: 'intermodalDetail/:id',
          access: 'o:documentation:intermodalDetail',
          component: '@/pages/documentation/intermodalDetail',
        },
      ]
    },
]