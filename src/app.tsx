import { defaultLanguage } from './ConfigSystemSettings';

export function render(oldRender: any) {
  // 写入默认语言
  if( localStorage.getItem('lang') == null ){
      localStorage.setItem('lang', defaultLanguage);
  }
  // 覆写 render。渲染之前做权限校验，
  // fetch('/api/auth').then(auth => {
  //   if (auth.isLogin) { oldRender() }
  //   else {
  //     location.href = '/login';
  //     oldRender()
  //   }
  // });

  oldRender();
}