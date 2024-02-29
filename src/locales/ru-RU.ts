import component from './ru-RU/component';
import globalHeader from './ru-RU/globalHeader';
import menu from './ru-RU/menu';
import pages from './ru-RU/pages';
import pwa from './ru-RU/pwa';
import settingDrawer from './ru-RU/settingDrawer';
import table from './ru-RU/table';
import tabsLayout from './ru-RU/tabsLayout';

export default {
  title: 'Система библиотеки продуктов',
  enter: 'Пожалуйста входите',
  select: 'пожалуйста, выбери',
  note: 'Примечание',
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...pwa,
  ...component,
  ...tabsLayout,
  ...table,
};
