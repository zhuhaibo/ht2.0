import { ProTable } from '@ant-design/pro-table';

const CommonTable = (props: any) => {
  return (
    <ProTable
      rowKey="id"
      bordered
      size='small'
      scroll={{ x: 1200 }}
      pagination={{defaultPageSize: 10}}
      search={{ layout: 'vertical', labelWidth: 'auto' }}
      rowClassName={(record: any, i: any): any => (i % 2 === 1 ? 'rowTableEven' : 'rowTableOdd')}
      options={{
        fullScreen: true, // 全屏
        density: false, // 大小
      }}
      {...props}
    />
  );
};

export default CommonTable;
