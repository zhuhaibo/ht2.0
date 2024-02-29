import DictSelect from '@/components/DictSelect';
import { QueryEnterpriseDetailApi, SaveOrUpdateEnterpriseApi } from '@/services/System/Enterprise';
import { parse } from '@/utils';
import { Col, Form, Input, Modal, Row, Tooltip, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface EnterpriseEditModalProps {
  visible: boolean;
  onCancel: (reload?: boolean) => void;
  record?: any;
}

const EnterpriseEditModal: FC<EnterpriseEditModalProps> = ({ visible, onCancel, record }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<any>();

  useEffect(() => {
    if (record) {
      setLoading(true);
      QueryEnterpriseDetailApi(record.id)
        .then((res: HttpResult<any>) => {
          if (res.ok) {
            const data = res.body;
            setCurrentRecord(data);
            form.setFieldsValue({ ...data });
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
      title={`企业${record ? '编辑' : '新建'}`}
      confirmLoading={loading}
      width={800}
      onCancel={() => {
        setCurrentRecord(undefined);
        form.resetFields();
        onCancel(false);
      }}
      onOk={form.submit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          const data = { ...values };
          setLoading(true);
          if (currentRecord && currentRecord.id) {
            data.id = currentRecord!!.id;
          }
          SaveOrUpdateEnterpriseApi(data)
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
              label={parse('enterprise.name')}
              name="name"
              rules={[{ required: true, message: parse('enterprise.enterName') }]}
            >
              <Input placeholder={parse('enter')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={
                <Tooltip title={parse('enterprise.notEdit')}>
                  {parse('enterprise.clientCode')}
                </Tooltip>
              }
              name="code"
              rules={[{ required: false, message: parse('enterprise.enterCode') }]}
            >
              <Input disabled placeholder={parse('enterprise.systemCreate')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={parse('enterprise.link')}
              name="linkman"
              rules={[{ required: true, message: parse('enterprise.enterLink') }]}
            >
              <Input placeholder={parse('enter')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={parse('enterprise.mobile')}
              name="mobile"
              rules={[{ pattern: /^1\d{10}$/, message: parse('enterprise.enterMobile') }]}
            >
              <Input placeholder={parse('enter')} />
            </Form.Item>
          </Col>
          {record ? null : (
            <Col span={8}>
              <Form.Item
                label={parse('enterprise.tenant')}
                name="tenant"
                rules={[{ required: false, message: parse('enterprise.selectTenant') }]}
              >
                <DictSelect type="tenant" placeholder={parse('enter')} />
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <Form.Item label={parse('note')} name="remark">
              <Input.TextArea rows={3} placeholder={parse('enter')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EnterpriseEditModal;
