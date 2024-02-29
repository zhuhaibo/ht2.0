import DictSelect from '@/components/DictSelect';
import { ColumnValidCheckApi, SaveOrUpdateUserApi } from '@/services/System/User';
import { parse } from '@/utils';
import { convertToMoment } from '@/utils/utils';
import { Col, DatePicker, Form, Input, Modal, Row, Select, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface UserCreateOrUpdateModalProps {
  visible: boolean;
  dataSource?: any;
  onCancel: (reload?: boolean) => void;
}

const UserCreateOrUpdateModal: FC<UserCreateOrUpdateModalProps> = ({
  visible,
  dataSource,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const timers: Map<string, NodeJS.Timeout> = new Map();

  useEffect(() => {
    if (dataSource) {
      form.setFieldsValue({
        ...convertToMoment(dataSource, 'birthday'),
        // 修改用户信息时 默认显示6位* 提交时进行过滤 如果还是6位* 则不更新密码
        password: '******',
      });
      form.setFieldsValue({ locked: true });
    } else {
      form.resetFields();
    }
  }, [dataSource]);

  const validCheck = (rule: any, type: string, data: any): Promise<void> => {
    if (timers.has(type)) {
      clearTimeout(timers.get(type)!!);
    }
    if (data === undefined || data === null || data === '') {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () =>
          ColumnValidCheckApi({
            id: dataSource ? dataSource.id : undefined,
            type,
            data,
          }).then((result: HttpResult<any>) => {
            if (result.ok) {
              resolve();
            } else {
              reject(result.message);
            }
          }),
        500,
      );
      timers.set(type, timer);
    });
  };

  const onFinish = (values: any) => {
    setLoading(true);
    const data = { ...values };
    if (dataSource && dataSource.id) {
      data.id = dataSource.id;
    }
    if (data.password === '******') {
      delete data.password;
    }
    // 用户绑定企业
    // if (data.enterprise) {
    //   data.customerCode = data.enterprise.value;
    //   delete data.enterprise;
    // }
    SaveOrUpdateUserApi(data)
      .then((res) => {
        if (res.ok) {
          message.success(parse('succeed'));
          onCancel(true);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      open={visible}
      title={dataSource ? parse('user.editUser') : parse('user.saveUser')}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={30}>
          <Col lg={12} md={12} sm={24}>
            {dataSource?.userName != null ? (
              <Form.Item label={parse('user.userName')} name="userName">
                <Input disabled={dataSource !== undefined} placeholder={parse('operate')} />
              </Form.Item>
            ) : (
              <Form.Item
                label={parse('user.userName')}
                name="userName"
                rules={[
                  { required: true, message: parse('user.nameEmpty') },
                  { pattern: /^[\w\d]+$/, message: parse('user.nameContain') },
                  { validator: (rule, value) => validCheck(rule, 'userName', value) },
                ]}
              >
                <Input placeholder={parse('operate')} />
              </Form.Item>
            )}
          </Col>
          <Col lg={12} md={12} sm={24}>
            <Form.Item
              label={parse('user.password')}
              name="password"
              rules={[
                { required: dataSource === undefined, message: parse('user.empty') },
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
              <Input disabled={dataSource !== undefined} placeholder={parse('operate')} />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <Form.Item label={parse('user.nick')} name="nickName">
              <Input placeholder={parse('operate')} />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <Form.Item label={parse('user.birthday')} name="birthday">
              <DatePicker style={{ width: '100%' }} placeholder={parse('operate')} />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <Form.Item label={parse('user.sex')} name="sex">
              <Select placeholder={parse('select')}>
                <Select.Option value={0}>{parse('user.woman')}</Select.Option>
                <Select.Option value={1}>{parse('user.man')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <Form.Item
              label={parse('user.email')}
              name="email"
              rules={[
                { type: 'email', message: parse('user.enterEmail') },
                { validator: (rule, value) => validCheck(rule, 'email', value) },
              ]}
            >
              <Input disabled={dataSource !== undefined} placeholder={parse('operate')} />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <Form.Item
              label={parse('user.mobile')}
              name="mobile"
              rules={[
                { pattern: /^1\d{10}$/, message: parse('user.enterMobile') },
                { validator: (rule, value) => validCheck(rule, 'mobile', value) },
              ]}
            >
              <Input disabled={dataSource !== undefined} placeholder={parse('operate')} />
            </Form.Item>
          </Col>
          {/*{dataSource ? null : (*/}
          <Col lg={12} md={12} sm={24}>
            <Form.Item
              label={parse('user.enterprise')}
              name="enterprise"
              rules={[{ required: true, message: parse('select') }]}
            >
              <DictSelect type="enterprise" placeholder={parse('select')} />
            </Form.Item>
          </Col>
          {/*)}*/}
        </Row>
      </Form>
    </Modal>
  );
};

export default UserCreateOrUpdateModal;
