import { DictCheckApi, DictSaveOrUpdateApi } from '@/services/System/Dict';
import { parse } from '@/utils';
import { Col, Form, Input, InputNumber, Modal, Radio, Row, Select, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface DictCreateOrUpdateModalProps {
  loading?: boolean;
  modalVisible: boolean;
  modalTitle?: string;
  currentRecord?: any;
  tabsDataSource?: any[];
  dictType?: string;
  onCancel: (reload?: 'item' | 'tabs') => void;
}

const DictCreateOrUpdateModal: FC<DictCreateOrUpdateModalProps> = (props) => {
  const [showTypeForm, setShowTypeForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const timers: Map<string, NodeJS.Timeout> = new Map();
  useEffect(() => {
    if (props.modalVisible) {
      form.setFieldsValue({
        ...props.currentRecord,
        type: props?.currentRecord?.type || props.dictType,
      });
    } else {
      form.resetFields();
    }
  }, [props.modalVisible, props.dictType]);

  // 防抖校验 600毫秒
  const validField = (rule: any, value: any, checkType: string): Promise<void> => {
    if (timers.has(checkType)) {
      clearTimeout(timers.get(checkType)!!);
    }
    if (value === undefined || value === null || value === '') {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () =>
          DictCheckApi({
            checkType,
            dictType: props.dictType,
            data: value,
            id: props.currentRecord ? props.currentRecord.id : undefined,
          }).then((result: HttpResult<any>) => {
            if (result.ok) {
              resolve();
            } else {
              reject(result.message);
            }
          }),
        500,
      );
      timers.set(checkType, timer);
    });
  };

  const handleSave = (values: any) => {
    setLoading(true);
    DictSaveOrUpdateApi({
      ...props.currentRecord,
      ...values,
    })
      .then((res: HttpResult<string>) => {
        if (res.ok) {
          message.success(parse('succeed'));
          form.resetFields();
          props.onCancel(values.type ? 'item' : 'tabs');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      open={props.modalVisible}
      confirmLoading={props.loading || loading}
      okText={parse('save')}
      closable={false}
      width={600}
      title={props.modalTitle}
      onCancel={() => {
        form.resetFields();
        setShowTypeForm(false);
        props.onCancel();
      }}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{
          option: 'item',
          type: props?.currentRecord?.type || props?.dictType,
        }}
        onFinish={(values) => handleSave(values as any)}
      >
        {props.modalTitle === parse('revise') ? null : (
          <Row>
            <Col md={24}>
              <Form.Item
                label={parse('dict.option')}
                name="option"
                rules={[{ required: true, message: parse('dict.enter.Option') }]}
              >
                <Radio.Group
                  onChange={(e) => {
                    setShowTypeForm(e.target.value === 'type');
                    form.resetFields(['type']);
                  }}
                >
                  <Radio value="item">{parse('dict.detail')}</Radio>
                  <Radio value="type">{parse('dict.type')}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        )}
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} lg={12} sm={24}>
            <Form.Item
              label={parse('dictCode')}
              name="code"
              rules={[
                { required: true, message: parse('dict.enterCode') },
                { validator: (rule, value) => validField(rule, value, 'code') },
              ]}
            >
              <Input allowClear placeholder={parse('dict.enterCode')} />
            </Form.Item>
          </Col>
          <Col md={12} lg={12} sm={24}>
            <Form.Item
              label={parse('dict.name')}
              name="name"
              rules={[
                { required: true, message: parse('dict.name') },
                { validator: (rule, value) => validField(rule, value, 'name') },
              ]}
            >
              <Input allowClear placeholder={parse('dict.enterName')} />
            </Form.Item>
          </Col>
        </Row>
        {showTypeForm ? null : (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} lg={12} sm={24}>
              <Form.Item label={parse('dict.type')} name="type">
                <Select disabled placeholder={parse('selectType')}>
                  {props?.tabsDataSource?.map((x) => (
                    <Select.Option value={x.code!!}>{x.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col md={12} lg={12} sm={24}>
              <Form.Item
                label={parse('dict.englishName')}
                name="englishName"
                rules={[
                  {
                    validator: (rule, value) => validField(rule, value, 'englishName'),
                  },
                ]}
              >
                <Input allowClear placeholder={parse('dict.enterEnglishName')} />
              </Form.Item>
            </Col>
          </Row>
        )}
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} lg={12} sm={24}>
            <Form.Item label={parse('dict.second')} name="sort">
              <InputNumber
                min={0}
                precision={0}
                placeholder={parse('dict.enterSecond')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        {showTypeForm ? null : (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} lg={24} sm={24}>
              <Form.Item label={parse('note')} name="remark">
                <Input.TextArea placeholder={parse('dict.enterNote')} />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default DictCreateOrUpdateModal;
