import { DeleteUserApi, LockUserApi, QueryUserListApi } from '@/services/System/User';
import { parse } from '@/utils';
import {
  codeAndNameToDictValue,
  emptyFormat,
  emptyFormatDate,
  emptyFormatDateTime,
  httpTableResultToRequestData,
  queryPageableConvert,
} from '@/utils/utils';
import { DownOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons/lib';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Divider, Dropdown, Menu, Modal, Switch, message } from 'antd';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import UserCreateOrUpdateModal from './UserCreateOrUpdateModal';
import UserPasswordResetModal from './UserPasswordResetModal';
import UserRole from './UserRoleModal';

const TenantList: FC = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [userModalProps, setUserModalProps] = useState<{
    dataSource?: any;
    visible: boolean;
  }>({
    dataSource: undefined,
    visible: false,
  });

  const [userPasswordResetModalProps, setUserPasswordResetModalProps] = useState<{
    visible: boolean;
    username?: string;
  }>({
    visible: false,
    username: undefined,
  });

  const [useToRoleData, setUseToRoleData] = useState<{
    visible: boolean;
    userId?: string;
  }>({
    visible: false,
    userId: undefined,
  });

  const changeLocked = (locked: boolean, id?: string) => {
    setLoading(true);
    LockUserApi({ id, locked })
      .then((res: HttpResult<string>) => {
        if (res.ok) {
          message.success(res.message);
          // actionRef.current?.reload()
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: ProColumns<any>[] = [
    {
      title: parse('user.account'),
      align: 'center',
      dataIndex: 'userName',
      fieldProps: {
        allowClear: true,
      },
      renderText: emptyFormat,
    },
    {
      title: parse('user.enterprise'),
      align: 'center',
      dataIndex: 'enterpriseName',
      fieldProps: {
        allowClear: true,
      },
      renderText: emptyFormat,
    },
    // {
    //   title: '密码',
    //   align: 'center',
    //   dataIndex: 'password',
    //   fieldProps: {
    //     allowClear: true,
    //   },
    //   renderText: emptyFormat,
    // },
    {
      title: parse('user.nick'),
      align: 'center',
      dataIndex: 'nickName',
      search: false,
      fieldProps: {
        allowClear: true,
      },
      renderText: emptyFormat,
    },
    {
      title: parse('user.avatar'),
      align: 'center',
      dataIndex: 'avatar',
      search: false,
      fieldProps: {
        allowClear: true,
      },
      renderText: emptyFormat,
    },
    {
      title: parse('user.email'),
      align: 'center',
      dataIndex: 'email',
      search: false,
      fieldProps: {
        allowClear: true,
      },
      renderText: emptyFormat,
    },
    {
      title: parse('user.mobile'),
      align: 'center',
      dataIndex: 'mobile',
      search: false,
      fieldProps: {
        allowClear: true,
      },
      renderText: emptyFormat,
    },
    {
      title: parse('user.birthday'),
      align: 'center',
      dataIndex: 'birthday',
      search: false,
      fieldProps: {
        allowClear: true,
      },
      renderText: emptyFormatDate,
    },
    {
      title: parse('user.sex'),
      align: 'center',
      dataIndex: 'sex',
      search: false,
      fieldProps: {
        allowClear: true,
      },
      renderText: (text) => (text === 1 ? parse('user.man') : parse('user.woman')),
    },
    {
      title: parse('createUser'),
      align: 'center',
      dataIndex: 'createdUser',
      search: false,
      renderText: emptyFormat,
    },
    {
      title: parse('createTime'),
      align: 'center',
      dataIndex: 'createdTime',
      renderText: emptyFormatDateTime,
      search: false,
    },
    {
      title: parse('user.locke'),
      align: 'center',
      dataIndex: 'locked',
      search: false,
      fixed: 'right',
      width: 100,
      // renderText: (text) => text ? '已锁定' : '未锁定',
      render: (value, record) => {
        return (
          <Switch
            checkedChildren={parse('user.unlocke')}
            unCheckedChildren={parse('user.locked')}
            defaultChecked={!record.locked}
            size="default"
            onChange={() => changeLocked(!record.locked, record.id)}
          />
        );
      },
    },
    {
      title: parse('operate'),
      fixed: 'right',
      align: 'center',
      width: 180,
      search: false,
      render: (text, record) => (
        <div>
          <a
            onClick={() =>
              setUserModalProps({
                dataSource: codeAndNameToDictValue(record, 'enterprise'),
                visible: true,
              })
            }
          >
            {parse('edit')}
          </a>
          <Divider type="vertical" />
          <a
            onClick={() =>
              setUserPasswordResetModalProps({ username: record.userName, visible: true })
            }
          >
            {parse('user.reset')}
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setUseToRoleData({ userId: record.id, visible: true });
            }}
          >
            {parse('user.empower')}
          </a>
        </div>
      ),
    },
  ];

  return (
    <PageContainer title={false} subTitle={false} breadcrumb={undefined}>
      <ProTable<any>
        actionRef={actionRef}
        rowKey="id"
        bordered
        size='small'
        toolBarRender={(action, { selectedRows }) => [
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setUserModalProps({ dataSource: undefined, visible: true })}
          >
            {parse('new')}
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={(e) => {
                    if (e.key === 'remove') {
                      Modal.confirm({
                        icon: <QuestionCircleOutlined />,
                        maskClosable: true,
                        title: parse('remove'),
                        content: parse('removeOrNot'),
                        onOk: async () => {
                          setLoading(true);
                          const ids: string[] = selectedRows.map((x) => x.id!!);
                          await DeleteUserApi(ids);
                          setLoading(false);
                          action?.reload();
                        },
                      });
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">{parse('batchDelete')}</Menu.Item>
                </Menu>
              }
            >
              <Button>
                {parse('batchOperate')} <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        loading={loading}
        request={async (params = {}) => {
          setLoading(true);
          const result = await QueryUserListApi(queryPageableConvert(params));
          setLoading(false);
          return httpTableResultToRequestData(result);
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        rowSelection={{
          fixed: true,
        }}
        scroll={{ x: 2000 }}
      />
      <UserPasswordResetModal
        visible={userPasswordResetModalProps.visible}
        username={userPasswordResetModalProps.username}
        onCancel={() => setUserPasswordResetModalProps({ username: undefined, visible: false })}
      />
      <UserCreateOrUpdateModal
        visible={userModalProps.visible}
        dataSource={userModalProps.dataSource}
        onCancel={(reload) => {
          setUserModalProps({ dataSource: undefined, visible: false });
          if (reload) {
            actionRef.current!!.reload();
          }
        }}
      />
      <UserRole
        visible={useToRoleData.visible}
        userId={useToRoleData.userId}
        onCancel={(reload) => {
          setUseToRoleData({ userId: undefined, visible: false });
          if (reload) {
            actionRef.current!!.reload();
          }
        }}
      />
    </PageContainer>
  );
};

export default TenantList;
