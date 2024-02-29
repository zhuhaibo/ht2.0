import { DictRemoveApi, DictTypOrContentListApi } from '@/services/System/Dict';
import { parse } from '@/utils';
import {
  calculateListNum,
  emptyFormat,
  emptyFormatDateTime,
  httpTableResultToRequestData,
  queryPageableConvert,
} from '@/utils/utils';
import { useAccess } from '@@/plugin-access';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Card, Popconfirm, Spin, Tabs, Tooltip, message } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import DictCreateOrUpdateModal from './DictCreateOrUpdateModal';

const DictList: FC = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tabsData, setTabsData] = useState<any[]>([]);
  const [currentTab, setCurrentTab] = useState<string>();
  const access = useAccess();
  const [modalProps, setModalProps] = useState<{
    visible: boolean;
    title?: string;
    currentRecord?: any;
  }>({
    visible: false,
    title: undefined,
    currentRecord: undefined,
  });

  const fetchDictTypeList = () => {
    setLoading(true);
    DictTypOrContentListApi({ size: 1000 })
      .then((res: HttpTableResult<any>) => {
        if (res.ok) {
          const data = res.body?.content || [];
          setTabsData(data);
          setCurrentTab(data.length > 0 ? data[0].code : undefined);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDictTypeList();
  }, [access['system:admin']]);

  const columns: ProColumns<any>[] = [
    {
      title: parse('index'),
      dataIndex: 'num',
      align: 'center',
      renderText(text: string) {
        return (
          <span className="number" style={{ fontWeight: 700, fontSize: '16px' }}>
            {text}
          </span>
        );
      },
      width: 100,
    },
    {
      title: parse('dict.code'),
      dataIndex: 'code',
      align: 'center',
      width: 200,
    },
    {
      title: parse('dict.name'),
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: parse('dict.englishName'),
      dataIndex: 'englishName',
      align: 'center',
      renderText: emptyFormat,
      width: 200,
    },
    {
      title: parse('note'),
      dataIndex: 'remark',
      align: 'center',
      renderText: emptyFormat,
      width: 200,
    },
    {
      title: parse('createUser'),
      dataIndex: 'createdUser',
      align: 'center',
      width: 200,
    },
    {
      title: parse('createTime'),
      dataIndex: 'createdTime',
      align: 'center',
      renderText: emptyFormatDateTime,
      width: 200,
    },
    {
      title: parse('operate'),
      fixed: 'right',
      align: 'center',
      width: 150,
      render: (text, record) => {
        // 如果有操作字典类型维护的权限，说明是超级管理员，可以修改系统字典
        if (access['system:admin']) {
          return (
            <div>
              <a
                onClick={() =>
                  setModalProps({ visible: true, title: parse('revise'), currentRecord: record })
                }
              >
                {parse('revise')}
              </a>
              <Popconfirm
                placement="topLeft"
                title={parse('removeOrNot')}
                onConfirm={() => {
                  setLoading(true);
                  DictRemoveApi([record.id!!])
                    .then((res: HttpResult<string>) => {
                      if (res.ok) {
                        message.success(parse('succeed'));
                        actionRef.current!!.reload();
                      }
                    })
                    .finally(() => setLoading(false));
                }}
              >
                <a style={{ marginLeft: '10px' }}>{parse('delete')}</a>
              </Popconfirm>
            </div>
          );
        }
        return record.owner === 'system' ? (
          parse('dict.notRevise')
        ) : (
          <div>
            <a
              onClick={() =>
                setModalProps({ visible: true, title: parse('revise'), currentRecord: record })
              }
            >
              {parse('revise')}
            </a>
            <Popconfirm
              placement="topLeft"
              title={parse('removeOrNot')}
              onConfirm={() => {
                setLoading(true);
                DictRemoveApi([record.id!!])
                  .then((res: HttpResult<string>) => {
                    if (res.ok) {
                      message.success(parse('succeed'));
                      actionRef.current!!.reload();
                    }
                  })
                  .finally(() => setLoading(false));
              }}
            >
              <a style={{ marginLeft: '10px' }}>{parse('delete')}</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer title={false} subTitle={false} breadcrumb={undefined}>
      <Spin spinning={loading}>
        <Card bordered={false}>
          <Tabs
            defaultActiveKey={currentTab}
            size="small"
            onChange={(e) => {
              setCurrentTab(e);
            }}
            tabPosition="top"
            // style={{ height: 600 }}
          >
            {tabsData.map((x) => {
              const { code, name } = x;
              return (
                <Tabs.TabPane
                  tab={
                    <Tooltip placement="left" mouseEnterDelay={1} title={code} key={code}>
                      <span>{name}</span>
                    </Tooltip>
                  }
                  key={code}
                >
                  {!currentTab ? null : (
                    <ProTable<any>
                      actionRef={actionRef}
                      rowKey="id"
                      toolBarRender={() => [
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() =>
                            setModalProps({
                              visible: true,
                              title: parse('new'),
                              currentRecord: undefined,
                            })
                          }
                        >
                          {parse('dict.newDict')}
                        </Button>,
                      ]}
                      search={false}
                      options={{ density: true, fullScreen: false, setting: false, reload: true }}
                      columns={columns}
                      request={async (params) => {
                        const result = await DictTypOrContentListApi(
                          queryPageableConvert({
                            ...params,
                            type: currentTab,
                          }),
                        );
                        return httpTableResultToRequestData(
                          calculateListNum(result, params.pageSize),
                        );
                      }}
                      scroll={{ x: 1100 }}
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
                  )}
                </Tabs.TabPane>
              );
            }) || []}
          </Tabs>
        </Card>
      </Spin>
      <DictCreateOrUpdateModal
        modalVisible={modalProps.visible}
        modalTitle={modalProps.title}
        onCancel={(reload) => {
          if (reload && reload === 'item') {
            actionRef.current!!.reload();
          }
          if (reload && reload === 'tabs') {
            fetchDictTypeList();
          }
          setModalProps({ ...modalProps, visible: false, currentRecord: undefined });
        }}
        tabsDataSource={tabsData}
        dictType={currentTab}
        currentRecord={modalProps.currentRecord}
      />
    </PageContainer>
  );
};

export default DictList;
