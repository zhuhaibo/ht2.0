import initialState from "../config/defaultSettings";
import { matchRoutes } from "umi";

export function render(oldRender: any) {
    // 写入默认语言
    if (localStorage.getItem("lang") == null) {
        localStorage.setItem("lang", initialState.defaultLanguage);
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

// initialState
export async function getInitialState() {
    return initialState;
}
// 路由变化
export function onRouteChange({ clientRoutes, location }: any) {
    const route: any = matchRoutes(clientRoutes, location.pathname)?.pop()
        ?.route;
    console.log("router change, check access!");
    if (route) {
        document.title = initialState.title + " - " + route.name;
    }
}
