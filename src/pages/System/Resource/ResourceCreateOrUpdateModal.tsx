import { CustomResourceIcon } from '@/pages/System/Resource/ResourceUtils';
import { QueryResourceDetailApi, SaveOrUpdateResourceApi } from '@/services/System/Resource';
import { parse } from '@/utils';
import { isBlank } from '@/utils/utils';
import { QuestionCircleOutlined } from '@ant-design/icons/lib';
import ProForm, { ProFormSwitch } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { Col, Form, Input, InputNumber, Modal, Row, Select, Space, Tooltip, message } from 'antd';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';

interface ResourceCreateOrUpdateModalProps {
  visible: boolean;
  onCancel: (reload?: boolean) => void;
  resourceId?: string;
  parentId?: string;
  applicationId?: string;
}

type RouterParameter = {
  id: React.Key;
  routerKey?: string;
  routerValue?: string;
  children?: RouterParameter[];
};

const ResourceCreateOrUpdateModal: FC<ResourceCreateOrUpdateModalProps> = ({
  visible,
  onCancel,
  resourceId,
  parentId,
  applicationId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  /**
   * 0 菜单
   * 1 操作
   * 2 接口
   */
  const [resourceType, setResourceType] = useState<string>('0');
  const [iconPreview, setIconPreview] = useState<string>();
  // const [currentRecord, setCurrentRecord] = useState<Resource>();

  // const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
  const [editForm] = Form.useForm();

  const columns: ProColumns<RouterParameter>[] = [
    {
      title: parse('resource.customizationKey'),
      dataIndex: 'routerKey',
      width: '30%',
      formItemProps: {
        rules: [
          {
            type: 'string',
            required: true,
            message: parse('resource.required'),
            whitespace: true,
          },
          {
            type: 'string',
            message: parse('resource.notEmpty'),
            whitespace: true,
          },
        ],
      },
    },
    {
      title: parse('resource.customizationValue'),
      dataIndex: 'routerValue',
      formItemProps: {
        rules: [
          {
            type: 'string',
            required: true,
            message: parse('resource.required'),
          },
          {
            type: 'string',
            message: parse('resource.notEmpty'),
            whitespace: true,
          },
        ],
      },
    },
    {
      title: parse('resource.operate'),
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          {parse('resource.edit')}
        </a>,
        <a
          key="delete"
          onClick={() => {
            form.setFields([
              {
                name: 'routerParameter',
                value: form
                  .getFieldValue('routerParameter')
                  .filter((x: RouterParameter) => x.id !== record.id),
              },
            ]);
          }}
        >
          {parse('resource.tree')}
        </a>,
      ],
    },
  ];
  useEffect(() => {
    if (!isBlank(resourceId)) {
      setLoading(true);
      QueryResourceDetailApi(resourceId)
        .then((res: HttpResult<any>) => {
          if (res.ok) {
            setResourceType(res.body!!.type!!);
            if (res.body?.icon) {
              setIconPreview(res.body.icon);
            }

            if (!isBlank(res.body?.routerParameter)) {
              // @ts-ignore
              const routerParameter = JSON.parse(res.body?.routerParameter);

              // @ts-ignore
              res.body!!.routerParameter = Object.keys(routerParameter).map((x) => ({
                id: x,
                routerKey: x,
                routerValue: routerParameter[x],
              }));
            } else {
              // @ts-ignore
              res.body!!.routerParameter = [];
            }
            form.setFieldsValue({ ...res.body });
          } else {
            history.push('/ResourceManager/list');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setResourceType('0');
      setIconPreview(undefined);
    }
  }, [resourceId]);

  const renderResourcePrefix = (type: string) => {
    switch (type) {
      case '0':
        return 'm:';
      case '1':
        return 'o:';
      case '2':
        return 'a:';
      default:
        return '';
    }
  };
  return (
    <Modal
      open={visible}
      centered
      title={!resourceId ? parse('resource.create') : parse('resource.modity')}
      confirmLoading={loading}
      width={800}
      onCancel={() => {
        setResourceType('0');
        form.resetFields();
        onCancel();
      }}
      onOk={form.submit}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ type: '0' }}
        onFinish={(values) => {
          const data = { ...values };
          setLoading(true);
          editForm
            .validateFields()
            .then((res) => {
              if (resourceId) {
                data.id = resourceId;
              } else {
                data.code = `${renderResourcePrefix(data.type)}${data.code}`;
              }
              if (parentId) {
                data.parentId = parentId;
              }
              if (applicationId) {
                data.applicationId = applicationId;
              }
              //如果去重之后的数量和去重之前的数量不相等就给个提示
              const routers = {};
              const routerParameter = form.getFieldValue('routerParameter');
              if (!isBlank(routerParameter)) {
                for (let i = 0; i < routerParameter.length; i++) {
                  const x = routerParameter[i];
                  if (routers[x.routerKey]) {
                    message.error(parse('resource.exited'));
                    setLoading(false);
                    return;
                  } else {
                    routers[x.routerKey] = x.routerValue;
                  }
                }
                data.routerParameter = JSON.stringify(routers);
              }
              {
                data.routerParameter = JSON.stringify({});
              }

              SaveOrUpdateResourceApi(data).then((rest: HttpResult<string>) => {
                if (rest.ok) {
                  message.success(parse('resource.succeed'));
                  onCancel(true);
                  form.resetFields();
                }
              });
            })
            .catch((res) => {
              const error = res.errorFields[0];
              message.error(error.name[1] + error.errors[0]);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        <Row gutter={30}>
          <Col span={8}>
            <Form.Item
              label={parse('resource.name')}
              name="name"
              rules={[{ required: true, message: parse('resource.writeName') }]}
            >
              <Input placeholder={parse('enter')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={parse('resource.code')}
              name="code"
              rules={[{ required: true, message: parse('resource.writeCode') }]}
            >
              <Input
                disabled={!isBlank(resourceId)}
                addonBefore={resourceId ? false : renderResourcePrefix(resourceType)}
                placeholder={parse('enter')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={parse('resource.type')}
              name="type"
              rules={[{ required: true, message: parse('resource.writeType') }]}
            >
              <Select
                disabled={!isBlank(resourceId)}
                placeholder={parse('select')}
                onChange={(value: any) => setResourceType(value)}
              >
                <Select.Option value="0">{parse('resource.menu')}</Select.Option>
                <Select.Option value="1">{parse('resource.operate')}</Select.Option>
                <Select.Option value="2">{parse('resource.interface')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label={parse('resource.order')}
              name="sort"
              rules={[{ required: true, message: parse('resource.writeOrder') }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder={parse('enter')} />
            </Form.Item>
          </Col>
          {resourceType === '0' ? (
            <>
              <Col span={8}>
                <Form.Item
                  label={
                    <span>
                      {parse('resource.url')}
                      <Tooltip title={parse('resource.default')}>
                        <QuestionCircleOutlined
                          style={{ marginLeft: '8px', color: 'rgba(0,0,0,.45)' }}
                        />
                      </Tooltip>
                    </span>
                  }
                  name="path"
                  rules={[{ required: true, message: parse('resource.writeUrl') }]}
                >
                  <Input placeholder={parse('select')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={parse('resource.open')}
                  name="target"
                  rules={[{ required: false, message: parse('resource.openType') }]}
                >
                  <Select allowClear placeholder={parse('resource.tree')}>
                    <Select.Option value="_self">_self</Select.Option>
                    <Select.Option value="_blank">_blank</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={parse('resource.description')}
                  name="description"
                  rules={[{ required: false, message: parse('resource.enterDescription') }]}
                >
                  <Input.TextArea placeholder={parse('enter')} />
                </Form.Item>
              </Col>
              {resourceType === '0' ? (
                <Col span={24}>
                  <Form.Item
                    label={
                      isBlank(iconPreview) ? (
                        parse('resource.icon')
                      ) : (
                        <span>
                          <Space>
                            {parse('resource.icon')}
                            <CustomResourceIcon type={iconPreview!!} />
                          </Space>
                        </span>
                      )
                    }
                    name="icon"
                    rules={[{ required: false, message: parse('resource.enterIcon') }]}
                  >
                    <Input
                      onChange={(v) => setIconPreview(v.target.value)}
                      placeholder={parse('enter')}
                    />
                  </Form.Item>
                </Col>
              ) : null}
              <Col span={24}>
                <Form.Item
                  label={parse('resource.component')}
                  name="component"
                  rules={[{ required: false, message: parse('resource.enterComponent') }]}
                >
                  <Input placeholder={parse('resource.select')} />
                </Form.Item>
              </Col>

              {/*是否报表*/}
              <Col span={8}>
                <ProFormSwitch
                  label={parse('resource.report')}
                  name="report"
                  rules={[{ required: false, message: parse('resource.reportOrNot') }]}
                  checkedChildren={parse('resource.yes')}
                  unCheckedChildren={parse('resource.deny')}
                />
              </Col>
            </>
          ) : null}
          {/* 当组件路径填写后才能添加路由自定义参数,key要保持唯一 */}
          {resourceType === '0' ? (
            <Col>
              <ProForm.Item name="routerParameter" trigger="onValuesChange">
                <EditableProTable<RouterParameter>
                  rowKey="id"
                  toolBarRender={false}
                  columns={columns}
                  recordCreatorProps={{
                    newRecordType: 'dataSource',
                    position: 'top',
                    creatorButtonText: parse('resource.data'),
                    record: () => ({
                      id: Date.now(),
                    }),
                  }}
                  editable={{
                    form: editForm,
                    type: 'multiple',
                    actionRender: (row, _, dom) => {
                      return [dom.delete];
                    },
                  }}
                />
              </ProForm.Item>
            </Col>
          ) : null}
        </Row>
      </Form>
    </Modal>
  );
};

export default ResourceCreateOrUpdateModal;
