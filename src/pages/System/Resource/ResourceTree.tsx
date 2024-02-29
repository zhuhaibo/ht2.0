import ResourceCreateOrUpdateModal from '@/pages/System/Resource/ResourceCreateOrUpdateModal';
import type { DataNode } from '@/pages/System/Resource/ResourceUtils';
import { resourceToTreeData } from '@/pages/System/Resource/ResourceUtils';
import { DeleteResourceApi, QueryResourceListApi } from '@/services/System/Resource';
import { isBlank } from '@/utils/utils';
import { useDebounceFn } from 'ahooks';
import { Spin, Tree, message } from 'antd';
import type { FC, Key } from 'react';
import { useEffect, useState } from 'react';

export interface ResourceTreeActionType {
  /**
   * 获取需要同步的新增数据
   */
  getSyncData: () => DataNode[];
  /**
   * 刷新资源树
   */
  refreshData: () => void;
}

interface ResourceTreeProps {
  /**
   * 组件引用
   */
  actionRef?:
    | React.MutableRefObject<ResourceTreeActionType | undefined>
    | ((actionRef: ResourceTreeActionType) => void);
  // 是否允许复选框
  checkable?: boolean;
  // 可否编辑
  operator?: boolean;
  // 父组件传递的加载状态
  loading?: boolean;
  // ======= From表单操控项 ========
  value?: string[];
  onChange?: (keys: Key[]) => void;
  searchData?: any;
  // 只查询自己有权限的资源
  selfResource?: boolean;
  // 数据加载结束后回调事件
  resultHandle?: any;
}

export const ResourceTree: FC<ResourceTreeProps> = (props) => {
  const {
    actionRef,
    checkable,
    operator,
    loading: preLoading,
    value,
    onChange,
    searchData,
    selfResource,
    resultHandle,
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [dataTree, setDataTree] = useState<DataNode[]>();
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [resourceState, setResourceState] = useState<{
    resourceId?: string;
    visible: boolean;
    parentId?: string;
  }>({
    resourceId: undefined,
    visible: false,
    parentId: undefined,
  });

  const { run: refreshData } = useDebounceFn(
    () => {
      // setLoading(true);
      // (selfResource ? QuerySelfResourceListApi() : QueryResourceListApi(props.applicationId!!))
      (selfResource ? QueryResourceListApi(searchData!!) : QueryResourceListApi(searchData!!))
        .then((res: HttpResult<any[]>) => {
          if (res.ok) {
            const remoteData = operator
              ? resourceToTreeData(
                  res.body!!,
                  // eslint-disable-next-line
                  menuAddClick,
                  // eslint-disable-next-line
                  resourceModifyClick,
                  // eslint-disable-next-line
                  resourceRemoveClick,
                  undefined,
                )
              : resourceToTreeData(res.body!!, undefined, undefined, undefined, undefined);
            setDataTree(remoteData);
          }
          resultHandle && resultHandle();
        })
        .finally(() => {
          setLoading(false);
          resultHandle && resultHandle();
        });
    },
    { wait: 200 },
  );

  useEffect(() => {
    if (searchData && searchData.type && searchData.data) {
      refreshData();
    }
  }, [searchData]);
  /**
   * 为actionRef绑定最新数据
   */
  useEffect(() => {
    const resourceTreeAction: ResourceTreeActionType = {
      getSyncData: () => dataTree || [],
      refreshData,
    };
    if (actionRef && typeof actionRef === 'function') {
      actionRef(resourceTreeAction);
    }
    if (actionRef && typeof actionRef !== 'function') {
      // eslint-disable-next-line no-param-reassign
      actionRef.current = resourceTreeAction;
    }
  }, [dataTree]);

  useEffect(() => {
    const checkData = (checkedKeys || []).filter((x) => x !== 'root');
    if (onChange) {
      if (checkData.sort().toString() !== value?.sort().toString()) {
        onChange(checkData);
      }
    }
  }, [checkedKeys]);

  useEffect(() => {
    if (!isBlank(value)) {
      setCheckedKeys(value!!);
    }
  }, [value]);

  const menuAddClick = (pid?: string) => {
    // pid为父级id如果为空则仅可创建顶级菜单
    setResourceState({ visible: true, parentId: pid });
  };

  const resourceModifyClick = (id: string) => {
    // 资源编辑时不允许更改父级元素
    setResourceState({ visible: true, resourceId: id });
  };

  const resourceRemoveClick = (id: string) => {
    // 资源删除 删除后刷新数据
    DeleteResourceApi(id)
      .then((res: HttpResult<String>) => {
        if (res.ok) {
          message.success('操作成功');
        }
      })
      .finally(() => refreshData());
  };

  return (
    <Spin spinning={preLoading || loading}>
      <style>{`
        .ant-tree-unselectable  .ant-tree-node-content-wrapper:hover {
           background-color: #f5f5f5;
        }
      `}</style>
      {!loading && dataTree && (
        <Tree
          showIcon
          blockNode
          selectable={false}
          checkable={checkable}
          checkStrictly={checkable}
          defaultExpandAll
          treeData={dataTree}
          showLine={{ showLeafIcon: false }}
          // @ts-ignore
          onCheck={({ checked, halfChecked }) =>
            setCheckedKeys([...(checked || []), ...(halfChecked || [])])
          }
          checkedKeys={checkedKeys}
        />
      )}
      <ResourceCreateOrUpdateModal
        applicationId={searchData?.data}
        parentId={resourceState.parentId}
        visible={resourceState.visible}
        resourceId={resourceState.resourceId}
        onCancel={(reload?: boolean) => {
          setResourceState({ visible: false, resourceId: undefined, parentId: undefined });
          if (reload) {
            refreshData();
          }
        }}
      />
    </Spin>
  );
};
