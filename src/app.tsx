import { defaultLanguage } from "./ConfigSystemSettings";
export function render(oldRender: any) {
    // 写入默认语言
    if (localStorage.getItem("lang") == null) {
        localStorage.setItem("lang", defaultLanguage);
    }
    // // 渲染前，做用户登陆状态及权限校验
    // fetch('/api/auth').then((auth: any)=> {
    //     if (auth.isLogin) { oldRender() }
    //     else {
    //         location.href = '/login';
    //         oldRender()
    //     }
    // });
    oldRender();
}
