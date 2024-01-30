import { Outlet } from 'umi';
import styles from './style.less';
import RenderMenus from './Menus/menus';
import RenderTopBar from './TopBar/topbar';
import HistoryRouter from './PanelTab/HistoryRouter';
import QueueAnim from 'rc-queue-anim';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { waterMarkTitle, panelTab } from '@/ConfigSystemSettings';
import { WaterMark } from '@ant-design/pro-components';
import { CommonStoreProvider } from '@/hooks';
import { defaultLanguage } from '@/ConfigSystemSettings';
import { ConfigProvider } from 'antd';

// antd 国际化配置
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
const localeArr: any = {
  "zh-CN": zhCN,
  "en-US": enUS,
}


export default function(){
  const { i18n } = useTranslation();
  const styleParams = panelTab ? {marginTop:40, minHeight: 'calc(100vh - 160px)'} : {};
  return (
    <ConfigProvider locale={localeArr[i18n.language || defaultLanguage]}>
      <CommonStoreProvider>
        <I18nextProvider i18n={i18n}>
            <WaterMark content={waterMarkTitle && waterMarkTitle}>
              <div className={styles.Ht_layout}>
                <div className={styles.Ht_Header} style={{top: 0}}>
                  <RenderTopBar />
                </div>
                <div className={styles.Ht_content}>
                  <RenderMenus />
                  <div className={styles.Ht_main} style={styleParams}>
                    <QueueAnim type={'bottom'} className="queue-simple">
                      <div key='outlet'> 
                        {/* <Outlet /> */}
                        <HistoryRouter Outlet={<Outlet />} />
                      </div>
                    </QueueAnim>
                  </div>
                </div>
              </div>
            </WaterMark>
        </I18nextProvider>
      </CommonStoreProvider>
    </ConfigProvider>
  )
}
