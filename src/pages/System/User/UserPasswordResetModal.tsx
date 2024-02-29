import { ResetPasswordApi } from '@/services/System/User';
import { parse } from '@/utils';
import { Col, Form, Input, Modal, Row, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface PasswordSettingModalProps {
  visible: boolean;
  username?: string;
  onCancel: () => void;
}

const UserPasswordResetModal: FC<PasswordSettingModalProps> = ({ visible, onCancel, username }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    form.resetFields();
  }, [visible]);

  return (
    <Modal
      open={visible}
      title={parse('user.reset')}
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={form.submit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          setLoading(true);
          ResetPasswordApi({
            username: username,
            ...values,
          })
            .then((res: HttpResult<string>) => {
              if (res.ok) {
                message.success(parse('succeed'));
                onCancel();
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        <Row gutter={30}>
          <Col span={20}>
            <Form.Item
              label={parse('user.newPassword')}
              name="password"
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
              hasFeedback
            >
              <Input.Password placeholder={parse('operate')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserPasswordResetModal;
