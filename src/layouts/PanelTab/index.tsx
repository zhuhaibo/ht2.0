import React, { useEffect, useState } from "react";
import styles from "../style.less";
import { Tooltip, Tag } from "antd";
import { useModel } from "umi";
import { CloseCircleOutlined, BugOutlined } from "@ant-design/icons";
import { localesMessage } from "@/utils/common";
import { useCommonStore } from "@/hooks";
import i18Json from "@/locale";

const PanelTabComponent = () => {
    const { initialState } = useModel("@@initialState");
    const { locale } = initialState || {};

    const { commonState } = useCommonStore();
    const colseTxt = locale ? localesMessage("colse") : "关闭";
    // 生成 historyMenus Data
    const createHistoryMenusData = () => {
        let TagPanelItem: any = [];
        commonState?.historyRouter?.forEach((el: any, index: number) => {
            TagPanelItem[index] = TagPanel(
                el,
                commonState.historyRouterActive.id === el.key ? 1 : 0,
            );
        });
        setTagPanelItem(TagPanelItem);
    };
    // 生成 historyMenus Component
    const TagPanel = (el: any, checked: number) => {
        const { store, language } = i18Json;
        const { translation }: any = store.data[language] || {};
        // 名称国际化
        const isLocaleMenuName = (name: string) =>
            locale
                ? (translation ? translation[name] : name) || (
                      <Tooltip
                          title={`国际化语言包未找到：${name} `}
                          style={{ float: "left" }}
                      >
                          <span style={{ color: "red" }}>
                              <BugOutlined /> undefined
                          </span>
                      </Tooltip>
                  )
                : name;
        return (
            <Tag
                color={checked ? "#3885f6" : ""}
                className={styles.tagDiv}
                closeIcon={
                    <Tooltip title={colseTxt} placement="right" color="#f00">
                        <CloseCircleOutlined
                            className={styles.tagIcon}
                            style={{ color: checked ? "#fff" : "" }}
                        />
                    </Tooltip>
                }
                onClose={(e: any) => {
                    e.preventDefault();
                    onClose(el);
                }}
                // closable
            >
                {isLocaleMenuName(el.label)}
            </Tag>
        );
    };
    // 关闭历史菜单
    const onClose = (el: any) => {
        console.log(el);
    };

    const [TagPanelItem, setTagPanelItem] = useState([]);
    // 渲染 历史 菜单
    useEffect(() => {
        createHistoryMenusData();
    }, [commonState.historyRouter]);
    // 公共状态中 lang 语言切换后重新渲染 历史 菜单
    useEffect(() => {
        createHistoryMenusData();
        // 监听浏览器地址变化并设置菜单选中状态
        // const historys = history.listen(() => createMenus(newRouterMenusArr));
        // return () => historys();
    }, [commonState.lang]);

    return (
        <div className={styles.historyContent}>
            <div className={styles.panelTab}>
                <div className={styles.segmentedDiv}>
                    {TagPanelItem?.map((item: any, index: number) => (
                        <React.Fragment key={index}>{item}</React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default PanelTabComponent;
