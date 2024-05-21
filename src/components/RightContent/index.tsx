import { FullscreenOutlined, GlobalOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang, useIntl } from '@umijs/max';
import { Tooltip, Tag } from 'antd';
import QueueAnim from 'rc-queue-anim';
import defaultSettings from '../../../config/defaultSettings';
import globalStyle from '../../global.less';

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return <UmiSelectLang style={{ padding: 4 }} key="UmiSelectLang" />;
};

export const TitleContent = () => {
  const intl = useIntl();
  // header center title
  return (
    <QueueAnim type="top">
      {/* <div key="titleDiv" className={globalStyle.titleDiv}>
        <h1>{intl.formatMessage({ id: 'title' })}</h1>
        <p>{defaultSettings.subTitle}</p>
      </div> */}
      <div key="titleDiv" style={{ display: 'flex', alignItems: 'center' }}>
        <div className={globalStyle.titleDiv}>
          <h1>{intl.formatMessage({ id: 'title' })}</h1>
          <p>{defaultSettings.subTitle} </p>
        </div>
        <Tag color="#1677ff" style={{ height: 24, marginLeft: 20 }}>
          {' '}
          <GlobalOutlined />{' '}
          {intl.formatMessage({
            id: 'typeTitle',
            defaultMessage: '海关总署',
          })}{' '}
        </Tag>
      </div>
    </QueueAnim>
  );
};
export const Question = () => {
  const intl = useIntl();
  // 全屏
  const fullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  return (
    <div style={{ lineHeight: 'normal', margin: 0, padding: 4 }}>
      <Tooltip
        title={intl.formatMessage({ id: 'component.tools.fullScreen', defaultMessage: '全屏' })}
      >
        <FullscreenOutlined onClick={fullScreen} style={{ fontSize: 18, color: '#888' }} />
      </Tooltip>
    </div>
  );
};
