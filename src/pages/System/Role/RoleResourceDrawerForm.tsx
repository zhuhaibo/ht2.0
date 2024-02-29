import DictSelect from '@/components/DictSelect';
import { ResourceTree } from '@/pages/System/Resource/ResourceTree';
import { ModifyRoleResourceApi, QueryRoleResourceListApi } from '@/services/System/Role';
import { parse } from '@/utils';
import { DrawerForm } from '@ant-design/pro-form';
import { Form, Space, Spin, message } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

export interface RoleResourceDrawerFormProps {
  visible?: boolean;
  roleId?: string;
  onClose: () => void;
}

const RoleResourceDrawerForm: FC<RoleResourceDrawerFormProps> = ({ visible, roleId, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [application, setApplication] = useState<string>();

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);

  useEffect(() => {
    if (roleId) {
      setLoading(true);
      QueryRoleResourceListApi(roleId)
        .then((resSub: HttpResult<any>) => {
          if (resSub.ok) {
            form.setFieldsValue({ resourceIds: resSub.body });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [roleId]);

  return (
    <Spin spinning={loading}>
      <DrawerForm<{ resourceIds: string[] }>
        form={form}
        title={
          <Space size="large">
            <span>{parse('user.roleManage')}</span>
            <DictSelect
              type="application"
              style={{ width: '300px' }}
              placeholder={parse('resource.select')}
              labelInValue={false}
              defaultSelectTopOne
              onChange={(v) => setApplication(v as string)}
            />
          </Space>
        }
        visible={visible}
        drawerProps={{
          onClose,
        }}
        onFinish={(value) => {
          setLoading(true);
          return ModifyRoleResourceApi({
            id: roleId,
            resourceIds: value.resourceIds,
          })
            .then((res: HttpResult<string>) => {
              if (res.ok) {
                message.success(parse('succeed'));
                onClose();
              }
            })
            .finally(() => setLoading(false));
        }}
      >
        {visible && (
          <Form.Item name="resourceIds">
            <ResourceTree
              searchData={{ type: 'application', data: application!! }}
              checkable
              selfResource={false}
            />
          </Form.Item>
        )}
      </DrawerForm>
    </Spin>
  );
};
export default RoleResourceDrawerForm;
