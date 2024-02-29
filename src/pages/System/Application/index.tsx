import RoleCreateOrUpdateModal from '@/pages/System/Role/RoleCreateOrUpdateModal';
import { QueryApplicationListApi } from '@/services/System/Application';
import { parse } from '@/utils';
import { httpTableResultToRequestData, queryPageableConvert } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FC } from 'react';
import { useRef, useState } from 'react';

const RoleList: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [roleState, setRoleState] = useState<{
    roleId?: string;
    modifyVisible: boolean;
  }>({
    roleId: undefined,
    modifyVisible: false,
  });

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: parse('table.appName'),
      dataIndex: 'name',
      fieldProps: { allowClear: true },
    },
    {
      title: parse('table.appCode'),
      dataIndex: 'clientId',
      fieldProps: { allowClear: true },
    },
    {
      title: parse('table.appDes'),
      dataIndex: 'description',
      search: false,
    },
    // {
    //   title: '操作',
    //   fixed: 'right',
    //   align: 'center',
    //   width: 200,
    //   search: false,
    //   render: (text: any, record: Role) => (
    //     <div>
    //       <a
    //         onClick={() => {
    //           setRoleState({ roleId: record.id, modifyVisible: true });
    //         }}
    //       >
    //         编辑
    //       </a>
    //       <Divider type="vertical" />
    //       <a
    //         onClick={() => {
    //           Modal.confirm({
    //             title: '操作确认',
    //             icon: <ExclamationCircleOutlined />,
    //             maskClosable: true,
    //             okText: '确认',
    //             cancelText: '取消',
    //             content: '确认删除吗？',
    //             onOk: async () => {
    //               const ids: string[] = [record.id!!];
    //               await DeleteRoleApi(ids);
    //               actionRef.current!!.reload();
    //             },
    //           });
    //         }}
    //       >
    //         删除
    //       </a>
    //     </div>
    //   ),
    // },
  ];

  return (
    <PageContainer title={false} subTitle={false} breadcrumb={undefined}>
      <ProTable<any>
        actionRef={actionRef}
        rowKey="id"
        loading={loading}
        request={async (params = {}) => {
          setLoading(true);
          const result = await QueryApplicationListApi(queryPageableConvert(params));
          setLoading(false);
          return httpTableResultToRequestData(result);
        }}
        columns={columns}
        // toolBarRender={() => [
        //   <Button
        //     icon={<PlusOutlined />}
        //     type="primary"
        //     onClick={() => {
        //       setRoleState({ roleId: undefined, modifyVisible: true });
        //     }}
        //   >
        //     新建
        //   </Button>,
        // ]}
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
    </PageContainer>
  );
};

export default RoleList;
