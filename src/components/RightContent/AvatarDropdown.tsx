import { outLogin } from '@/services/Login/api';
import {
  ExclamationCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history, useIntl, useModel } from '@umijs/max';
import { Button, Modal, Spin } from 'antd';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.nickName}</span>;
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();
  /**
   * 退出登录，并且将当前的 url 保存
   */
  // user - out
  const [modal, contextHolder] = Modal.useModal();

  const loginOut = async () => {
    const modalTitle = intl.formatMessage({
      id: 'component.tips',
      defaultMessage: '提示',
    });
    const modalContent = intl.formatMessage({
      id: 'component.isLogout',
      defaultMessage: '是否确定退出系统？',
    });
    const modalButton = intl.formatMessage({ id: 'component.isLogout.yes' });
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
          style={{ float: 'right' }}
          onClick={async () => {
            await outLogin();
            localStorage.clear();
            const { search, pathname } = window.location;
            const urlParams = new URL(window.location.href).searchParams;
            /** 此方法会跳转到 redirect 参数所在的位置 */
            const redirect = urlParams.get('redirect');
            // Note: There may be security issues, please note
            if (window.location.pathname !== '/login' && !redirect) {
              history.replace({
                pathname: '/login',
                search: stringify({
                  redirect: pathname + search,
                }),
              });
            }
            flushSync(() => {
              setInitialState((s) => ({ ...s, currentUser: undefined }));
            });
            Modal.destroyAll();
          }}
        >
          {modalButton}
        </Button>,
      ],
    });
  };

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.nickName) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: intl.formatMessage({
              id: 'menu.account.center',
              defaultMessage: '个人中心',
            }),
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: intl.formatMessage({
              id: 'menu.account.settings',
              defaultMessage: '个人设置',
            }),
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: intl.formatMessage({
        id: 'menu.account.logout',
        defaultMessage: '退出登录',
      }),
    },
  ];

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      {contextHolder}
    </>
  );
};
