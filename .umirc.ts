import { defineConfig } from "umi";
import initialState from './config/defaultSettings';

export default defineConfig({
  title: initialState.title,
  npmClient: 'yarn',
  hash: true,
  plugins: [
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
  ],
  initialState: {},
  model: {},
  antd: {},
  targets: { ie: 11 },
  routes: [
    // 登录页
    { path: "/login", component: "@/pages/login", layout: false },
    { path: '/', redirect: initialState.initPath },
    { path: '/*', component: '404' },
    { path: '/welcome', component: '@/pages/welcome', access: "m:welcome", name:'welcome' },
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
});
