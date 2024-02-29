import { QueryEnterpriseListApi } from '@/services/System/Enterprise';
import { parse } from '@/utils';
import { emptyFormat, httpTableResultToRequestData, queryPageableConvert } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import { FC, useRef, useState } from 'react';
import EnterpriseEditModal from './EnterpriseEditModal';

const Index: FC = () => {
  const actionRef = useRef<ActionType>();
  const [enterpriseEditModalProps, setEnterpriseEditModalProps] = useState<{
    dataSource?: any;
    visible: boolean;
  }>({
    dataSource: undefined,
    visible: false,
  });
  const columns: ProColumns<any>[] = [
    {
      title: parse('enterprise.name'),
      dataIndex: 'name',
      renderText: emptyFormat,
      key: 'name',
    },
    {
      title: parse('enterprise.code'),
      dataIndex: 'code',
      renderText: emptyFormat,
    },
    // {
    //   title: '所属租户',
    //   width: 150,
    //   align: 'center',
    //   dataIndex: 'tenantName',
    //   search: false,
    //   fieldProps: { allowClear: true },
    // },
    {
      title: parse('operate'),
      search: false,
      render: (text, record) => (
        <div>
          <a onClick={() => setEnterpriseEditModalProps({ dataSource: record, visible: true })}>
            {parse('edit')}
          </a>
        </div>
      ),
    },
  ];

  return (
    <PageContainer title={false} subTitle={false} breadcrumb={undefined}>
      <ProTable<any>
        rowKey="id"
        actionRef={actionRef}
        tableLayout="fixed"
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" onClick={() => setEnterpriseEditModalProps({ visible: true })}>
            {parse('new')}
          </Button>,
        ]}
        request={async (params = {}) => {
          const result = await QueryEnterpriseListApi(
            queryPageableConvert({
              ...params,
            }),
          );
          return httpTableResultToRequestData(result);
        }}
        pagination={{
          pageSize: 10,
        }}
        form={{
          labelCol: {
            xs: {
              span: 24,
            },
            sm: {
              span: 8,
            },
          },
        }}
      />
      <EnterpriseEditModal
        visible={enterpriseEditModalProps.visible}
        record={enterpriseEditModalProps.dataSource}
        onCancel={(reload) => {
          setEnterpriseEditModalProps({ dataSource: undefined, visible: false });
          if (reload) {
            actionRef.current!!.reload();
          }
        }}
      />
    </PageContainer>
  );
};

export default Index;
