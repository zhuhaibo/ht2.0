import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pages from './zh-CN/pages';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import table from './zh-CN/table';
import tabsLayout from './zh-CN/tabsLayout';

export default {
  title: '哈萨克斯坦跨境电商监管系通',
  enter: '请输入',
  select: '请选择',
  note: '备注',
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...pwa,
  ...component,
  ...tabsLayout,
  ...table,
};
