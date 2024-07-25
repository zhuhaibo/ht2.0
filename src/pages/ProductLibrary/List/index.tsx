import type { ActionType } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import ModalComponent from '../Modal';
import TableComponent from '../Table';
import { Helmet } from '@umijs/max';

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};
export default () => {
  const actionRef = useRef<ActionType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowsData, setRowsData] = useState<any>({});

  // 映射 打开编辑弹窗
  const showModal = (record: any) => {
    setRowsData(record);
    setIsModalOpen(true);
  };
  // 映射 Modal 确认事件
  const ModalSubmit = () => {
    TableReload();
    ModalCancel();
  };
  // 映射 Modal 关闭事件
  const ModalCancel = () => setIsModalOpen(false);

  // reRender Table
  const TableReload = () => {
    actionRef.current?.reload();
  };
  return (
    <PageContainer header={{ title: null, subTitle: null }} breadcrumb={undefined}>
      {/* 商品库 Table */}
      <TableComponent
        PropsJson={{
          actionRef,
          showModal,
          TableReload,
        }}
      />

      {/* 映射 Modal */}
      <ModalComponent
        PropsJson={{
          isModalOpen,
          ModalCancel,
          ModalSubmit,
          data: {
            rowsData,
          },
        }}
      />
    </PageContainer>
  );
};
