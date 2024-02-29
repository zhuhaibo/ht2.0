import { QueryRoleDetailApi, SaveOrUpdateRoleApi } from '@/services/System/Role';
import { parse } from '@/utils';
import { isBlank } from '@/utils/utils';
import { Col, Form, Input, Modal, Row, Spin, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface RoleCreateOrUpdateModalProps {
  visible: boolean;
  onCancel: (reload?: boolean) => void;
  roleId?: string;
}

const RoleCreateOrUpdateModal: FC<RoleCreateOrUpdateModalProps> = ({
  visible,
  onCancel,
  roleId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<any>();

  useEffect(() => {
    if (visible && !isBlank(roleId)) {
      setLoading(true);
      QueryRoleDetailApi(roleId).then((res: HttpResult<any>) => {
        if (res.ok) {
          const data = res.body;
          setCurrentRecord(data);
          form.setFieldsValue({ ...data });
          setLoading(false);
        }
      });
    }
  }, [visible]);

  return (
    <Modal
      open={visible}
      title={parse('user.roleEdit')}
      confirmLoading={loading}
      width={800}
      onCancel={() => {
        setCurrentRecord(undefined);
        form.resetFields();
        onCancel(false);
      }}
      onOk={form.submit}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const data = { ...values };
            setLoading(true);
            if (currentRecord && currentRecord.id) {
              data.id = currentRecord!!.id;
            }
            // 角色绑定租户
            // if (data.tenant) {
            //   data.tenantId = data.tenant.value;
            //   delete data.tenant;
            // }
            // data.tenantId = '1';
            SaveOrUpdateRoleApi(data)
              .then((res: HttpResult<string>) => {
                if (res.ok) {
                  message.success(parse('succeed'));
                }
              })
              .finally(() => {
                setLoading(false);
                onCancel(true);
              });
          }}
        >
          <Row gutter={30}>
            <Col span={8}>
              <Form.Item
                label={parse('user.roleName')}
                name="name"
                rules={[{ required: true, message: parse('user.enterRoleName') }]}
              >
                <Input placeholder={parse('enter')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={parse('user.code')}
                name="code"
                rules={[{ required: true, message: parse('user.enterRoleCode') }]}
              >
                <Input disabled={!isBlank(roleId)} placeholder={parse('enter')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={parse('user.description')}
                name="description"
                rules={[{ required: true, message: parse('user.enterRoleDescription') }]}
              >
                <Input placeholder={parse('enter')} />
              </Form.Item>
            </Col>
            {/*{roleId ? null : (*/}
            {/*  <Col span={8}>*/}
            {/*    <Form.Item*/}
            {/*      label="所属租户"*/}
            {/*      name="tenant"*/}
            {/*      rules={[{ required: false, message: '请选择所属租户' }]}*/}
            {/*    >*/}
            {/*      <DictSelect type="tenant" labelShowValue={false} placeholder="请输入" />*/}
            {/*    </Form.Item>*/}
            {/*  </Col>*/}
            {/*)}*/}
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default RoleCreateOrUpdateModal;
