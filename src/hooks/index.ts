import { useState } from 'react'
import { createStore } from 'hox'
import { defaultLanguage } from '@/ConfigSystemSettings';
const langs = localStorage.getItem('lang');
const lng = langs ? langs : defaultLanguage;

export const [useCommonStore, CommonStoreProvider]: any = createStore(() => {
  const [state, setState] = useState({
    collapsed: false, // 菜单是否收起
    lang: lng,  // 默认语言
    menus: [], // 菜单
    menusActive: {}, // 菜单选中
    historyRouter: [], // 菜单历史记录
  })

  const set = (params: any) => setState(params);
  
  return { 
    commonState: state, 
    set 
  }
})