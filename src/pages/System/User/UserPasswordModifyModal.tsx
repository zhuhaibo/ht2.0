import { ModifyPasswordApi } from '@/services/System/User';
import { parse } from '@/utils';
import { Col, Form, Input, Modal, Row, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface PasswordModifyModalProps {
  visible: boolean;
  onCancel: () => void;
}

const UserPasswordModifyModal: FC<PasswordModifyModalProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    form.resetFields();
  }, [visible]);

  return (
    <Modal
      open={visible}
      title={parse('user.editPassword')}
      confirmLoading={loading}
      width={400}
      onCancel={() => {
        onCancel();
      }}
      onOk={form.submit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          setLoading(true);
          ModifyPasswordApi({
            password: values.password,
            newPassword: values.newPassword,
          })
            .then((res: HttpResult<string>) => {
              if (res.ok) {
                message.success(parse('succeed'));
                window.location.reload();
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        <Row gutter={30}>
          <Col span={24}>
            <Form.Item
              label={parse('user.originalPassword')}
              name="password"
              rules={[{ required: true, message: parse('user.enterOriginalPassword') }]}
            >
              <Input.Password placeholder={parse('operate')} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={parse('user.newPassword')}
              name="newPassword"
              hasFeedback
              rules={[
                { required: true, message: parse('user.newPasswordNo') },
                { min: 6, message: parse('user.length') },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (/^\d+$/.exec(value)) {
                      return Promise.reject(new Error(parse('user.combination')));
                    }
                    if (/^[A-Za-z]+$/.exec(value)) {
                      return Promise.reject(new Error(parse('user.combination')));
                    }
                    if (!/^[\w!@#$%^&*_]+$/.exec(value)) {
                      return Promise.reject(new Error(parse('user.contain')));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.Password placeholder={parse('operate')} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={parse('user.confirm')}
              name="confirm"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: parse('user.again') },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(parse('user.noMatch')));
                  },
                }),
              ]}
            >
              <Input.Password placeholder={parse('operate')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserPasswordModifyModal;
