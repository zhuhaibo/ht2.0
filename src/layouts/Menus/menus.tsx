import { history, useModel } from "umi";
import { Spin, Menu, Tooltip } from "antd";
import styles from "../style.less";
import routerMenusArr from "./menus.json";
import { Iconfont } from "@/utils/common";
import { useEffect, useState } from "react";
import {
    LoadingOutlined,
    MenuFoldOutlined,
    BugOutlined,
} from "@ant-design/icons";
import { useCommonStore } from "@/hooks";
import i18Json from "@/locale";
import _ from "lodash";

const Index = () => {
    const { initialState } = useModel("@@initialState");
    const { locale, panelTab } = initialState || {};
    // 公共状态
    const { commonState, set } = useCommonStore();
    // 状态管理
    const [state, setState] = useState<any>({
        menus: [],
        menusLoads: true,
    });
    const [menusActive, setMenusActive] = useState<any>({
        defaultOpenSelectKey: "",
        defaultSelectedKeys: "",
    });
    // 菜单跳转
    const menusClick = (e: any) => {
        const reEach = (arr: any) => {
            arr.forEach((element: any) => {
                if (element.id === e.key) {
                    const codeStr = element.code.substring(
                        2,
                        element.code.length,
                    );
                    // 记录历史菜单
                    if (panelTab) {
                        const addHistoryRouter = [
                            ...commonState.historyRouter,
                            {
                                el: element,
                                key: element.id,
                                label: element.name,
                            },
                        ];
                        set({
                            ...commonState,
                            historyRouterActive: element,
                            historyRouter: _.uniqBy(addHistoryRouter, "el.id"),
                        });
                    }
                    history.push("/" + codeStr.replace(/:/g, "/"));
                }
                if (element.id !== e.key && element?.children?.length > 0) {
                    reEach(element.children);
                }
            });
        };
        reEach(state.menus);
    };
    // 菜单渲染
    const removeParentIdAndAddParentId = (obj: any) => {
        if (typeof obj === "object" && obj !== null) {
            if (obj.parentId || obj.parentId === null) {
                obj.parent_id = obj.parentId;
                delete obj.parentId;
            }
            for (let key in obj) {
                if (typeof obj[key] === "object") {
                    removeParentIdAndAddParentId(obj[key]);
                }
            }
        }
    };
    const eachMenusActive = (data: any) => {
        let setSelectKey: any = {};
        const reFunc = (arr: any) => {
            arr.forEach((v: any, k: number) => {
                if (
                    setSelectKey.defaultOpenSelectKey === undefined ||
                    setSelectKey.defaultSelectedKeys === undefined
                ) {
                    // 浏览器历史记录URL访问时，初始化菜单选中状态
                    const codePath = v.code
                        .replace(/:/g, "/")
                        .replace("m/", "/");
                    const name1 = codePath
                        ?.split("/")
                        .filter((res: any) => res !== "")[0];
                    const name2 = history.location.pathname
                        .split("/")
                        .filter((res) => res !== "")[0];
                    if (name1 === name2) {
                        if (!v?.parent_id) {
                            setSelectKey.defaultOpenSelectKey = v.id;
                        }
                        if (codePath === history.location.pathname) {
                            setSelectKey = {
                                defaultOpenSelectKey: v.parent_id,
                                defaultSelectedKeys: v.id,
                            };
                        } else {
                            if (v?.children?.length > 0) {
                                const name3 = history.location.pathname
                                    .split("/")
                                    .filter((res) => res !== "")[1];
                                if (
                                    v.children.filter(
                                        (res: any) => res.path === name3,
                                    ).length <= 0
                                ) {
                                    setSelectKey.defaultSelectedKeys = v.id;
                                }
                            }
                        }
                    }
                    if (
                        codePath !== history.location.pathname &&
                        v?.children?.length > 0
                    ) {
                        return reFunc(v.children);
                    }
                }
            });
        };
        reFunc(data);
        return setSelectKey;
    };
    const createMenus = (ajaxMenus: any) => {
        const { store, language } = i18Json;
        const { translation }: any = store.data[language] || {};
        // 名称国际化
        const isLocaleMenuName = (name: string) =>
            locale
                ? (translation ? translation[name] : name) || (
                      <Tooltip title={`国际化语言包未找到：${name} `}>
                          <div style={{ color: "red" }}>
                              <BugOutlined /> undefined
                          </div>
                      </Tooltip>
                  )
                : name;
        // 数组重构
        const getMenusItem = (v: any) => ({
            ...v,
            icon: <Iconfont type={v.icon} style={{ fontSize: 18 }} />,
        });
        const resetMenus = (arr: any) =>
            arr.map((v: any) => {
                v.key = v.id;
                v.label = isLocaleMenuName(v.name);
                v.children && resetMenus(v.children);
                return getMenusItem(v);
            });
        // 初始化菜单 item data
        const menusItem = resetMenus(ajaxMenus);
        const newMenusActive = eachMenusActive(ajaxMenus);
        setMenusActive(newMenusActive);
        setState({ ...state, menusLoads: false, menus: menusItem });
    };
    // 公共状态中 lang 语言切换后重新渲染 menu 菜单
    useEffect(() => {
        // bug query请求，获取menus菜单数据后，执行菜单渲染，删除“parentId”关键词，使用小写“parent_id”，antd menus 兼容性问题
        setState({ ...state, menusLoads: true });
        const newRouterMenusArr = routerMenusArr;
        removeParentIdAndAddParentId(newRouterMenusArr);
        createMenus(newRouterMenusArr);
        // 监听浏览器地址变化并设置菜单选中状态
        const historys = history.listen(() => createMenus(newRouterMenusArr));
        return () => historys();
    }, [commonState.lang]);

    return (
        <div
            className={styles.leftMenusDiv}
            style={{ width: commonState.collapsed ? 50 : 250 }}
        >
            <div className={styles.menusDiv}>
                <Spin
                    spinning={state.menusLoads}
                    indicator={<LoadingOutlined />}
                >
                    <div className={styles.menusUser}>
                        <p>
                            <Iconfont
                                type="icon-user-avatar"
                                style={{ fontSize: 16, marginRight: 5 }}
                            />
                            {!commonState.collapsed ? (
                                <span style={{ lineHeight: 1 }}>
                                    Administrator
                                </span>
                            ) : null}
                        </p>
                    </div>
                </Spin>
                <div
                    className={styles.MenuItemDiv}
                    style={{ width: commonState.collapsed ? 50 : 250 }}
                >
                    <Spin
                        spinning={state.menusLoads}
                        indicator={<LoadingOutlined />}
                    >
                        <div style={{ width: "100%", minHeight: 100 }}>
                            {!state.menusLoads ? (
                                <Menu
                                    mode="inline"
                                    inlineCollapsed={commonState.collapsed}
                                    defaultOpenKeys={[
                                        menusActive.defaultOpenSelectKey,
                                    ]}
                                    selectedKeys={[
                                        menusActive.defaultSelectedKeys,
                                    ]}
                                    style={{ width: "100%" }}
                                    items={state.menus}
                                    onClick={menusClick}
                                />
                            ) : null}
                        </div>
                    </Spin>
                </div>
                <div className={styles.MenuFoldOutIconDiv}>
                    <MenuFoldOutlined
                        className={styles.menuIconCircle}
                        onClick={() => {
                            set({
                                ...commonState,
                                collapsed: !commonState.collapsed,
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Index;
