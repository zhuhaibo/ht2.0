import { defineConfig } from "umi";
import initialState from './config/defaultSettings';
import routers from './config/router';
export default defineConfig({
  antd: {},
  model: {},
  hash: true,
  routes: routers,
  initialState: {},
  npmClient: 'yarn',
  title: initialState.title,
  codeSplitting: { jsStrategy: 'granularChunks' },
  plugins: [
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
  ],
});
