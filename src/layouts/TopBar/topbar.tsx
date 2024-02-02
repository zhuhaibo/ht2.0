import styles from "../style.less";
import QueueAnim from "rc-queue-anim";
import { history, useModel } from "umi";
import { useCommonStore } from "@/hooks";
import PanelTabComponent from "../PanelTab";
import { localesMessage } from "@/utils/common";
import LanguageComponent from "../Language/language";
import { Space, Dropdown, Button, Badge, Modal, Tooltip } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    FullscreenOutlined,
    HomeFilled,
    DownOutlined,
    AliwangwangOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";

const Index = () => {
    const { initialState } = useModel("@@initialState");
    const { title, subtitle, logo, minlogo, locale, panelTab } =
        initialState || {};
    const userMenusItems: any = [
        {
            key: "1",
            label: locale ? localesMessage("userCenter") : "用户中心",
            icon: <UserOutlined />,
        },
    ];
    // user - out
    const [modal, contextHolder] = Modal.useModal();
    const modalTitle = locale ? localesMessage("prompt") : "提示！";
    const modalContent = locale
        ? localesMessage("isLogout")
        : "是否确定退出系统 ...";
    const modalButton = locale ? localesMessage("yes") : "是";
    const outHandle = (e: any) => {
        if (e.key === "out") {
            modal.confirm({
                title: modalTitle,
                icon: <ExclamationCircleOutlined />,
                content: modalContent,
                closable: true,
                footer: [
                    <Button
                        key="yes"
                        type="primary"
                        danger
                        style={{ float: "right" }}
                        onClick={() => {
                            Modal.destroyAll();
                            history.push("/login");
                        }}
                    >
                        {modalButton}
                    </Button>,
                ],
            });
        }
    };
    // 全屏
    const fullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };
    // Title component
    const TitleComponent = () =>
        title ? (
            <div className={styles.Ht_title}>
                <h1 title={title}>
                    {locale
                        ? localesMessage("sysTitle")
                        : "弘泰天元数据管理系统"}
                </h1>
                <p>{subtitle}</p>
            </div>
        ) : null;
    // Logo component
    const LogoComponent = () => {
        const { commonState } = useCommonStore();
        return (
            <div
                className={styles.Ht_logo}
                style={{ width: commonState.collapsed ? 50 : 250 }}
            >
                {commonState.collapsed ? (
                    <img src={minlogo} alt={title} />
                ) : (
                    <img src={logo} alt={title} />
                )}
            </div>
        );
    };
    return (
        <QueueAnim animConfig={[{ opacity: [1, 0], translateY: [0, -50] }]}>
            <div className={styles.Ht_topbar} key="RenderTopBar">
                <LogoComponent />
                <div className={styles.topbarRightContent} key="RenderTopBar1">
                    <div className={styles.topbarRightContentItem}>
                        <TitleComponent />
                        <div className={styles.Ht_toolsAndUsers}>
                            <div className={styles.tools}>
                                <Space size={20}>
                                    {locale && <LanguageComponent />}
                                    <Tooltip
                                        title={
                                            locale
                                                ? localesMessage("fullScreen")
                                                : "全屏"
                                        }
                                    >
                                        <Button
                                            onClick={fullScreen}
                                            icon={<FullscreenOutlined />}
                                        ></Button>
                                    </Tooltip>
                                    <Tooltip
                                        title={
                                            locale
                                                ? localesMessage("notice")
                                                : "通知"
                                        }
                                    >
                                        <Badge count={5}>
                                            <Button
                                                icon={<AliwangwangOutlined />}
                                            ></Button>
                                        </Badge>
                                    </Tooltip>
                                </Space>
                            </div>
                            <Dropdown
                                trigger={["click"]}
                                menu={{
                                    items: userMenusItems.concat([
                                        { type: "divider" },
                                        {
                                            key: "out",
                                            danger: true,
                                            icon: <LogoutOutlined />,
                                            label: localesMessage("logout"),
                                        },
                                    ]),
                                    onClick: outHandle,
                                }}
                            >
                                <div className={styles.users}>
                                    <Space>
                                        <HomeFilled />
                                        <span>
                                            {locale
                                                ? localesMessage("userName")
                                                : "北京弘泰天元科技有限公司"}
                                        </span>
                                        <DownOutlined />
                                    </Space>
                                </div>
                            </Dropdown>
                            {contextHolder}
                        </div>
                    </div>
                    {panelTab && <PanelTabComponent />}
                </div>
            </div>
        </QueueAnim>
    );
};

export default Index;
