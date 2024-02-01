import React, { useEffect } from "react";
import styles from "../style.less";
import { Tooltip, Tag } from "antd";
import { panelTab } from "@/ConfigSystemSettings";
import { CloseCircleOutlined } from "@ant-design/icons";

const PanelTabComponent = () => {
    const TagPanel = (text: string, checked: number) => (
        <Tag
            color={checked ? "#3885f6" : ""}
            className={styles.tagDiv}
            closeIcon={
                <Tooltip title="关闭" placement="right" color="#f50">
                    <CloseCircleOutlined
                        className={styles.tagIcon}
                        style={{ color: checked ? "#fff" : "" }}
                    />
                </Tooltip>
            }
            closable
        >
            {text}
        </Tag>
    );
    const TagPanelItem = [
        TagPanel("首页", 0),
        TagPanel("用户管理", 1),
        TagPanel("编辑用户管理", 0),
        TagPanel("资源管理", 0),
        TagPanel("添加资源管理", 0),
        TagPanel("编辑资源管理", 0),
        TagPanel("仙路尽头谁为峰，一见原始道成空！", 0),
        TagPanel("仙之巅，傲世间，有我安澜便有天！", 0),
    ];
    return panelTab ? (
        <div className={styles.historyContent}>
            <div className={styles.panelTab}>
                <div className={styles.segmentedDiv}>
                    {TagPanelItem.map((item: any, index: number) => (
                        <React.Fragment key={index}>{item}</React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    ) : null;
};
export default PanelTabComponent;
