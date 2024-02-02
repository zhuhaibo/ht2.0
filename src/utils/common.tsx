import initialState from "../../config/defaultSettings";
import { createFromIconfontCN } from "@ant-design/icons/lib";
import { useTranslation } from "react-i18next";

// iconfont
export const Iconfont: any = createFromIconfontCN({
    scriptUrl: initialState.iconfont,
});
// 国际化 i18n
export const localesMessage = function (key: string) {
    if (initialState.locale) {
        const { t } = useTranslation();
        return key ? t(key) : key;
    } else {
        return key;
    }
};
