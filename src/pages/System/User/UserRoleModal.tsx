import { QueryRoleListApi, UserGrantRoleApi } from '@/services/System/Role';
import { QueryCurrentRoleApi } from '@/services/System/User';
import { parse } from '@/utils';
import { httpTableResultToRequestData, queryPageableConvert } from '@/utils/utils';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Modal, message } from 'antd';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

interface UserRoleModalProps {
  visible: boolean;
  userId?: string;
  onCancel: (reload?: boolean) => void;
}

const UserRole: FC<UserRoleModalProps> = ({ visible, userId, onCancel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentRoleIds, setCurrentRoleIds] = useState<any>();
  const [oldRoleIds, setOldRoleIds] = useState<any>();
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    if (visible) {
      setLoading(true);
      QueryCurrentRoleApi(userId)
        .then((res: HttpResult<any[]>) => {
          if (res.ok) {
            actionRef.current?.reload();
            const roleIds = res.body?.map((x) => x.id);
            setOldRoleIds(roleIds);
            setCurrentRoleIds(roleIds);
          } else {
            onCancel();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible]);
  return (
    <Modal
      open={visible}
      title={parse('user.authorization')}
      confirmLoading={loading}
      width={500}
      destroyOnClose
      onCancel={() => {
        setOldRoleIds(undefined);
        setCurrentRoleIds(undefined);
        onCancel();
      }}
      onOk={() => {
        if (JSON.stringify(oldRoleIds.sort()) !== JSON.stringify(currentRoleIds.sort())) {
          UserGrantRoleApi({ userId, roleIds: currentRoleIds })
            .then((res: HttpResult<string>) => {
              if (res.ok) {
                message.success(parse('user.authorizated'));
              }
            })
            .finally(() => {
              setLoading(false);
              onCancel(true);
            });
        } else {
          message.warning(parse('user.role'));
        }
      }}
    >
      <ProTable<any>
        rowKey="id"
        actionRef={actionRef}
        loading={loading}
        options={false}
        search={false}
        tableAlertRender={({ selectedRowKeys }) =>
          parse('user.assigned') + `${selectedRowKeys.length}` + parse('user.roles')
        }
        request={async (params = {}) => {
          setLoading(true);
          const result = await QueryRoleListApi(queryPageableConvert(params));
          setLoading(false);
          return httpTableResultToRequestData(result);
        }}
        columns={[
          { title: parse('user.roleName'), align: 'center', dataIndex: 'name' },
          { title: parse('user.description'), align: 'center', dataIndex: 'description' },
        ]}
        pagination={{
          pageSize: 10,
        }}
        rowSelection={{
          preserveSelectedRowKeys: true,
          fixed: true,
          selectedRowKeys: currentRoleIds,
          onChange: (keys) => {
            setCurrentRoleIds(keys);
          },
        }}
      />
    </Modal>
  );
};

export default UserRole;
