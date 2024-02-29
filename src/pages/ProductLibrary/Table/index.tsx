import { QueryCommodityStandardList } from '@/services/Pages/ProductLibrary';
import {
  emptyFormat,
  formatDataTimeReg,
  formatToDateRange,
  httpTableResultToRequestData,
  queryPageableConvert,
} from '@/utils/utils';
import { FormOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { getLocale, useIntl } from '@umijs/max';

function TableContainer(props: any) {
  const { actionRef, showModal, TableReload } = props.PropsJson;
  const intl = useIntl();

  const columns: any = [
    {
      dataIndex: 'index',
      valueType: 'index',
      title: intl.formatMessage({ id: 'table.index', defaultMessage: '序号' }),
      width: 110,
      align: 'center',
      fixed: 'left',
    },
    {
      title: intl.formatMessage({
        id: 'productLibrary.table.codeZH',
        defaultMessage: '商品编码(中方)',
      }),
      dataIndex: 'commodityCode',
      ellipsis: true,
      align: 'center',
      width: 150,
      tooltip: intl.formatMessage({
        id: 'productLibrary.table.codeZH',
        defaultMessage: '商品编码(中方)',
      }),
    },
    {
      title: intl.formatMessage({
        id: 'productLibrary.table.nameZH',
        defaultMessage: '商品名称(中方)',
      }),
      dataIndex: 'commodityName',
      align: 'center',
      ellipsis: true,
      width: 150,
      tooltip: intl.formatMessage({
        id: 'productLibrary.table.nameZH',
        defaultMessage: '商品编码(中方)',
      }),
    },
    {
      title: intl.formatMessage({
        id: 'productLibrary.table.codeKZ',
        defaultMessage: '商品编码(哈方)',
      }),
      dataIndex: 'commodityCodeKz',
      ellipsis: true,
      align: 'center',
      width: 150,
      tooltip: intl.formatMessage({
        id: 'productLibrary.table.codeKZ',
        defaultMessage: '商品编码(中方)',
      }),
    },
    {
      title: intl.formatMessage({
        id: 'productLibrary.table.nameKZ',
        defaultMessage: '商品名称(哈方)',
      }),
      dataIndex: 'commodityNameKz',
      ellipsis: true,
      align: 'center',
      width: 150,
      tooltip: intl.formatMessage({
        id: 'productLibrary.table.nameKZ',
        defaultMessage: '商品编码(中方)',
      }),
    },
    {
      title: intl.formatMessage({ id: 'productLibrary.table.notes', defaultMessage: '备注' }),
      dataIndex: 'remark',
      align: 'center',
      ellipsis: true,
      width: 300,
    },
    {
      disable: true,
      title: intl.formatMessage({
        id: 'productLibrary.table.mapStatus',
        defaultMessage: '映射状态',
      }),
      dataIndex: 'mapStatus',
      onFilter: true,
      align: 'center',
      ellipsis: true,
      valueType: 'select',
      fixed: 'right',
      width: 150,
      renderText: emptyFormat,
      valueEnum: {
        已映射: {
          text: intl.formatMessage({
            id: 'productLibrary.table.mapStatus1',
            defaultMessage: '已映射',
          }),
          status: 'Success',
        },
        未映射: {
          text: intl.formatMessage({
            id: 'productLibrary.table.mapStatus2',
            defaultMessage: '未映射',
          }),
          status: 'Error',
        },
      },
    },
    {
      disable: true,
      title: intl.formatMessage({ id: 'productLibrary.table.status', defaultMessage: '使用状态' }),
      dataIndex: 'status',
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      fixed: 'right',
      align: 'center',
      width: 150,
      valueEnum: {
        正常: {
          text: intl.formatMessage({ id: 'productLibrary.table.status1', defaultMessage: '正常' }),
          status: 'Success',
        },
        已禁用: {
          text: intl.formatMessage({
            id: 'productLibrary.table.status2',
            defaultMessage: '已禁用',
          }),
          status: 'Error',
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'productLibrary.table.optUser', defaultMessage: '操作人' }),
      dataIndex: 'optUser',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'productLibrary.table.optTime', defaultMessage: '操作时间' }),
      dataIndex: 'optTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 180,
      render: (text: string, record: any) => {
        return getLocale() == 'ru-RU'
          ? formatDataTimeReg(record.optTime, 'DD/MM/YYYY HH:mm:ss')
          : text;
      },
    },
    {
      title: intl.formatMessage({ id: 'productLibrary.table.optTime', defaultMessage: '操作时间' }),
      dataIndex: 'optTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value: any) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'table.option', defaultMessage: '操作' }),
      key: 'option',
      fixed: 'right',
      align: 'center',
      width: 160,
      render: (text: string, record: any) => [
        <a
          key="edit"
          onClick={() => {
            showModal(record);
          }}
        >
          <FormOutlined /> {intl.formatMessage({ id: 'table.edit', defaultMessage: '编辑' })}
        </a>,
      ],
    },
  ];

  //多tabs布局切换回列表页，监听路由变化，开启多 tabs 页配置时有用
  // useEffect(() => {
  //   // 在路由变化时执行的逻辑
  //   const handleRouteChange = () => {
  //     if( history.location.pathname == '/productlibrary' ){
  //       TableReload();
  //     }
  //   };
  //   // 监听路由变化事件
  //   const unlisten = history.listen(handleRouteChange);
  //   // 在组件卸载时取消监听
  //   return () => { unlisten() };
  // },[location]);

  return (
    <ProTable<any>
      rowKey="id"
      columns={columns}
      scroll={{ x: 1500 }}
      actionRef={actionRef}
      search={{ layout: 'vertical', labelWidth: 'auto' }}
      request={async (params = {}) => {
        const result = await QueryCommodityStandardList(
          queryPageableConvert(formatToDateRange(params, 'optTime')),
        );
        return httpTableResultToRequestData(result);
      }}
    />
  );
}

export default TableContainer;
