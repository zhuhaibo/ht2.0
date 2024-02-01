import { defineConfig } from "umi";
import { initPath, title } from './src/ConfigSystemSettings';

export default defineConfig({
  title,
  npmClient: 'yarn',
  hash: true,
  routes: [
    // 登录页
    { path: "/login", component: "@/pages/login", layout: false },
    { path: '/', redirect: initPath },
    { path: '/*', component: '404' },
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
