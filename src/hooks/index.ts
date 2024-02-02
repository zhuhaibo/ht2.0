import { useState } from 'react'
import { createStore } from 'hox'
import { useModel } from 'umi';

export const [useCommonStore, CommonStoreProvider]: any = createStore(() => {
  const { initialState } = useModel('@@initialState');
  const { defaultLanguage } = initialState || {};
  const langs = localStorage.getItem('lang');
  const lng = langs ? langs : defaultLanguage;
  const [state, setState] = useState({
    collapsed: false, // 菜单是否收起
    lang: lng,  // 默认语言
    historyRouterActive: {},
    historyRouter: [],
  })

  const set = (params: any) => setState(params);
  
  return { 
    commonState: state, 
    set 
  }
})