import { QueryCommodityKzUpdate } from '@/services/Pages/ProductLibrary';
import { useIntl } from '@umijs/max';
import { Card, Descriptions, Form, Input, Modal, Space, message } from 'antd';
import { useEffect } from 'react';
import { runes } from 'runes2';

function ModalFunction(props: any) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { isModalOpen, ModalCancel, ModalSubmit, data } = props.PropsJson;
  const { rowsData } = data;

  const handleFinish = async (values: any) => {
    QueryCommodityKzUpdate({
      ...values,
      id: rowsData.id,
    }).then((res: any) => {
      if (res.ok) {
        message.success('操作成功');
        ModalSubmit();
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    ModalCancel();
  };

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        code: rowsData.commodityCodeKz,
        name: rowsData.commodityNameKz,
      });
    }
  }, [isModalOpen]);

  return (
    <Modal
      title={intl.formatMessage({
        id: 'productLibrary.modal.title',
        defaultMessage: '商品库映射',
      })}
      open={isModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={1000}
    >
      <Space>
        <Card style={{ width: 520, height: 450 }}>
          {/* <Descriptions title="" items={items} column={1} /> */}
          <Descriptions
            title={intl.formatMessage({
              id: 'productLibrary.modal.form.titleZH',
              defaultMessage: '中方商品信息',
            })}
            column={1}
          >
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.codeZH',
                defaultMessage: '商品编码(中方)',
              })}
            >
              {' '}
              {rowsData?.commodityCode}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.nameZH',
                defaultMessage: '商品名称(中方)',
              })}
            >
              {' '}
              {rowsData?.commodityName}{' '}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.gmodel',
                defaultMessage: '规格型号',
              })}
            >
              {rowsData?.gmodel}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.commodityAliasName',
                defaultMessage: '别名',
              })}
            >
              {' '}
              {rowsData?.commodityAliasName}{' '}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.brand',
                defaultMessage: '品牌',
              })}
            >
              {' '}
              {rowsData?.brand}{' '}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.monitoringCondition',
                defaultMessage: '监管条件',
              })}
            >
              {' '}
              {rowsData?.monitoringCondition}{' '}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.unit',
                defaultMessage: '法定计量单位',
              })}
            >
              {' '}
              {rowsData?.unit}{' '}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.unit1',
                defaultMessage: '第二计量单位',
              })}
            >
              {' '}
              {rowsData?.unit1}{' '}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.status',
                defaultMessage: '使用状态',
              })}
            >
              {' '}
              {rowsData?.status}{' '}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card style={{ width: 400, height: 450 }}>
          <Descriptions
            title={intl.formatMessage({
              id: 'productLibrary.modal.form.titleKZ',
              defaultMessage: '哈方商品信息',
            })}
            column={1}
          ></Descriptions>
          <Form form={form} onFinish={handleFinish}>
            <Form.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.codeKZ',
                defaultMessage: '哈方商品编码',
              })}
              name="code"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'productLibrary.modal.formCheck.codeKZ',
                    defaultMessage: '请输入哈方商品编码',
                  }),
                },
              ]}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'productLibrary.modal.formCheck.codeKZ',
                  defaultMessage: '请输入哈方商品编码',
                })}
              />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.nameKZ',
                defaultMessage: '哈方商品名称',
              })}
              name="name"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'productLibrary.modal.formCheck.nameKZ',
                    defaultMessage: '请输入哈方商品名称',
                  }),
                },
              ]}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'productLibrary.modal.formCheck.nameKZ',
                  defaultMessage: '请输入哈方商品名称',
                })}
              />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({
                id: 'productLibrary.table.notes',
                defaultMessage: '备注',
              })}
              name="remark"
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'productLibrary.modal.formCheck.remark',
                    defaultMessage: '请输入备注',
                  }),
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder={intl.formatMessage({
                  id: 'productLibrary.modal.formCheck.remarklength',
                  defaultMessage: '最多输入500字符',
                })}
                count={{
                  show: true,
                  max: 500,
                  strategy: (txt) => runes(txt).length,
                  exceedFormatter: (txt, { max }) => runes(txt).slice(0, max).join(''),
                }}
              />
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Modal>
  );
}
export default ModalFunction;
