import DictSelect from '@/components/DictSelect';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Card, Space } from 'antd';
import { useRef, useState } from 'react';
import { ResourceTree, ResourceTreeActionType } from './ResourceTree';

export default function () {
  const intl = useIntl();
  const [loadingTree, setLoadingTree] = useState(true);
  const [application, setApplication] = useState<string>();
  const resourceTreeActionRef = useRef<ResourceTreeActionType>();
  const resultHandle = () => setLoadingTree(false);
  return (
    <PageContainer title={false} subTitle={false} breadcrumb={undefined}>
      <Card
        title={
          <Space size="large">
            <span>
              {intl.formatMessage({ id: 'system.resource.tree', defaultMessage: '资源树' })}
            </span>
            <DictSelect
              type="application"
              style={{ width: '300px' }}
              labelInValue={false}
              defaultSelectTopOne
              onChange={(v) => setApplication(v as string)}
            />
          </Space>
        }
        bodyStyle={{ minHeight: 400 }}
      >
        <ResourceTree
          loading={loadingTree}
          operator={true}
          actionRef={resourceTreeActionRef}
          searchData={{ type: 'application', data: application!! }}
          resultHandle={resultHandle}
        />
      </Card>
    </PageContainer>
  );
}
