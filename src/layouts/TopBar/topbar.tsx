import React from 'react';
import { history } from 'umi';
import styles from '../style.less';
import QueueAnim from 'rc-queue-anim';
import { logoPath, logo, minlogo, locale } from '@/ConfigSystemSettings';
import { Space, Dropdown, Button, Badge, Modal, message, Tooltip } from 'antd';
import { UserOutlined, 
    LogoutOutlined, FullscreenOutlined, HomeFilled, 
    DownOutlined, AliwangwangOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import {useCommonStore} from '@/hooks';
import LanguageComponent from '../Language/language';
import PanelTabComponent from '../PanelTab';

const title = '跨国铁路数字单证综合服务平台'
const userMenusItems: any = [ { key: '1', label: '用户中心', icon: <UserOutlined /> }];
// Title component
const TitleComponent = () => (title ? <div className={styles.Ht_title}>
    <h1 title={title}>{title}</h1>
    <p>Transnational railway digital document service platform</p>
    </div>
: null);
// Logo component
const LogoComponent = () => {
    const { commonState } = useCommonStore();
    return (
        <div className={styles.Ht_logo} style={{width: commonState.collapsed ? 50 : 250}}>
            {commonState.collapsed ? <img src={minlogo} alt={title} /> : <img src={logo} alt={title} />}
        </div>
    )
}
const Index = () => {
    const [messageApi, messageContextHolder] = message.useMessage();
    // user - out
    const [modal, contextHolder] = Modal.useModal();
    const outHandle = (e: any) => {
        if(e.key === 'out'){
            modal.confirm({
                title: '提示！',
                icon: <ExclamationCircleOutlined />,
                content: '是否确定退出系统 ...',
                closable: true,
                footer: [
                    <Button key="yes" type="primary" danger style={{float: 'right'}} onClick={()=>{
                        messageApi.error('已退出登录！');
                        Modal.destroyAll();
                        history.push('/login');
                    }}>确认</Button>
                ]
            });
        }
    }
    // 全屏
    const fullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }else {
            document.exitFullscreen();
        }
    }
    return (
        <QueueAnim animConfig={[{ opacity: [1, 0], translateY: [0, -50] }]}>
            <div className={styles.Ht_topbar} key='RenderTopBar'>
                <LogoComponent />
                <div className={styles.topbarRightContent} key='RenderTopBar1'>
                    <div className={styles.topbarRightContentItem}>
                        <TitleComponent />
                        <div className={styles.Ht_toolsAndUsers}>
                            <div className={styles.tools}>
                                <Space size={20}>
                                    { locale && <LanguageComponent />}
                                    <Tooltip title="全屏">
                                        <Button onClick={fullScreen} icon={<FullscreenOutlined />}></Button>
                                    </Tooltip>
                                    <Tooltip title="通知">
                                        <Badge count={5}>
                                            <Button icon={<AliwangwangOutlined />}></Button>
                                        </Badge>
                                    </Tooltip>
                                </Space>
                            </div>
                            <Dropdown trigger={['click']} menu={{ 
                                items: userMenusItems.concat([
                                    { type: 'divider' },
                                    { key: 'out', danger: true, icon: <LogoutOutlined />, label: '退出系统' },
                                ]),
                                onClick: outHandle
                            }}>
                                <div className={styles.users}>
                                <Space>
                                    <HomeFilled />
                                    <span>北京弘泰天元科技有限公司</span>
                                    <DownOutlined />
                                </Space>
                                </div>
                            </Dropdown>
                            {contextHolder}
                            {messageContextHolder}
                        </div>
                    </div>
                    <PanelTabComponent />
                </div>
            </div>
        </QueueAnim>
    );
}

export default Index;
