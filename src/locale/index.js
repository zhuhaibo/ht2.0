import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import initialState from "../../config/defaultSettings";
// 导入语言资源文件
import enUS from "./locales/en-US.js";
import zhCN from "./locales/zh-CN.js";

const langs = localStorage.getItem("lang");
const lng = langs ? langs : initialState.defaultLanguage;

// 设置 i18n 配置
i18n.use(initReactI18next).init({
  lng, // 默认语言
  resources: {
    "zh-CN": { translation: zhCN },
    "en-US": { translation: enUS },
  },
  fallbackLng: initialState.defaultLanguage, // 回退语言
  interpolation: {
    escapeValue: false, // 不转义特殊字符
  },
});

export default i18n;
