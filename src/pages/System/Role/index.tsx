import { DeleteRoleApi, QueryRoleListApi } from '@/services/System/Role';
import { parse } from '@/utils';
import { httpTableResultToRequestData, queryPageableConvert } from '@/utils/utils';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons/lib';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Divider, Modal } from 'antd';
import { FC, useRef, useState } from 'react';
import RoleCreateOrUpdateModal from './RoleCreateOrUpdateModal';
import RoleResourceDrawerForm from './RoleResourceDrawerForm';

const RoleList: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [roleState, setRoleState] = useState<{
    roleId?: string;
    modifyVisible: boolean;
  }>({
    roleId: undefined,
    modifyVisible: false,
  });
  const [roleResourceFormState, setRoleResourceFormState] = useState<{
    visible?: boolean;
    roleId?: string;
  }>({ visible: false });

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: parse('user.roleName'),
      dataIndex: 'name',
      fieldProps: { allowClear: true },
    },
    {
      title: parse('user.code'),
      dataIndex: 'code',
      fieldProps: { allowClear: true },
    },
    {
      title: parse('user.description'),
      dataIndex: 'description',
      fieldProps: { allowClear: true },
      search: false,
    },
    {
      title: parse('operate'),
      search: false,
      render: (text: any, record: any) => (
        <div>
          <a
            onClick={() => {
              setRoleState({ roleId: record.id, modifyVisible: true });
            }}
          >
            {parse('edit')}
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setRoleResourceFormState({
                visible: true,
                roleId: record.id,
              });
            }}
          >
            {parse('user.resource')}
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              Modal.confirm({
                title: parse('user.confirmed'),
                icon: <ExclamationCircleOutlined />,
                maskClosable: true,
                okText: parse('confirm'),
                cancelText: parse('cancel'),
                content: parse('removeOrNot'),
                onOk: async () => {
                  const ids: string[] = [record.id!!];
                  await DeleteRoleApi(ids);
                  actionRef.current!!.reload();
                },
              });
            }}
          >
            {parse('delete')}
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
        loading={loading}
        request={async (params = {}) => {
          setLoading(true);
          const result = await QueryRoleListApi(queryPageableConvert(params));
          setLoading(false);
          return httpTableResultToRequestData(result);
        }}
        columns={columns}
        toolBarRender={() => [
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setRoleState({ roleId: undefined, modifyVisible: true });
            }}
          >
            {parse('new')}
          </Button>,
        ]}
      />
      <RoleCreateOrUpdateModal
        visible={roleState.modifyVisible}
        roleId={roleState.roleId}
        onCancel={(reload?: boolean) => {
          setRoleState({ modifyVisible: false, roleId: undefined });
          if (reload) {
            actionRef.current!!.reload();
          }
        }}
      />
      <RoleResourceDrawerForm
        visible={roleResourceFormState.visible}
        roleId={roleResourceFormState.roleId}
        onClose={() => setRoleResourceFormState({ visible: false, roleId: undefined })}
      />
    </PageContainer>
  );
};

export default RoleList;
