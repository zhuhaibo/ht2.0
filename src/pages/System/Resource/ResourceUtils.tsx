import { parse } from '@/utils';
import { isBlank } from '@/utils/utils';
import {
  createFromIconfontCN,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from '@ant-design/icons/lib';
import { message, Popconfirm, Tag, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import React from 'react';
import defaultSettings from '../../../../config/defaultSettings';

export interface DataNode {
  // 注意: id仅在资源树页面可取到值
  id?: string;
  title: React.ReactNode;
  key: string;
  code: string;
  type: string;
  // 禁止勾选
  disableCheckbox?: boolean;
  isLeaf?: boolean;
  children?: DataNode[];
  style?: React.CSSProperties;
  // 是否为新资源
  isNew?: boolean;
  // 新资源标题
  originTitle?: string;
  // 排序
  sort?: number;
}

export const CustomResourceIcon = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl, // 在 iconfont.cn 上生成
});

/**
 *
 * @param item
 * @param resourceModifyClick   修改按钮点击事件
 * @param resourceRemoveClick   删除按钮点击事件
 */
const modifyOrDelete = (
  item: any,
  resourceModifyClick?: (id: string) => void,
  resourceRemoveClick?: (id: string) => void,
) => (
  <span style={{ float: 'right' }}>
    {resourceModifyClick && (
      <EditTwoTone
        twoToneColor="#409eff"
        style={{ marginRight: '10px' }}
        onClick={() => resourceModifyClick(item.id!!)}
      />
    )}
    {resourceRemoveClick && (
      <Popconfirm
        placement="topLeft"
        title={parse('resource.remove') + ` [${item.name}] ` + parse('resource.what')}
        onConfirm={() => resourceRemoveClick(item.id!!)}
      >
        <DeleteTwoTone twoToneColor="#F56C6C" />
      </Popconfirm>
    )}
  </span>
);

/**
 * 操作节项生成
 * @param operationAction     需要渲染的操作
 * @param resourceModifyClick 修改按钮点击事件
 * @param resourceRemoveClick 删除按钮点击事件
 * @param hiddenTip           隐藏code提示
 */
export const resourceOperationActionsToTreeData = (
  operationAction: any,
  resourceModifyClick?: (id: string) => void,
  resourceRemoveClick?: (id: string) => void,
  hiddenTip?: boolean,
): DataNode => {
  return {
    id: operationAction.id!!,
    key: operationAction.id!!,
    code: operationAction.code,
    type: operationAction.type!!,
    sort: operationAction.sort,
    title: (
      <>
        <Tooltip
          placement="top"
          title={operationAction.code}
          {...() => (hiddenTip ? { visible: false } : {})}
        >
          <span>
            {operationAction.type === '1' ? (
              <Tag color="warning">{parse('resource.operate')}</Tag>
            ) : (
              <Tag color="processing">接口</Tag>
            )}
            {operationAction.name}
          </span>
        </Tooltip>
        {(resourceModifyClick || resourceRemoveClick) && (
          <table style={{ float: 'right', width: '600px' }}>
            <tr>
              <td style={{ width: '260px' }} />
              <td style={{ width: '300px' }}>
                {isBlank(operationAction.code) ? null : (
                  <Tag
                    color="geekblue"
                    onClick={() =>
                      copy(operationAction.code!!)
                        ? message.success(parse('resource.copy'))
                        : message.error(parse('resource.copyFail'))
                    }
                  >
                    {operationAction.code}
                  </Tag>
                )}
              </td>
              <td>{modifyOrDelete(operationAction, resourceModifyClick, resourceRemoveClick)}</td>
            </tr>
          </table>
        )}
      </>
    ),
  };
};

/**
 * 菜单行渲染
 * @param item                需要渲染的菜单项
 * @param menuAddClick        新增按钮点击事件
 * @param resourceModifyClick 修改按钮点击事件
 * @param resourceRemoveClick 删除按钮点击事件
 * @param hiddenTip           隐藏code提示
 */
const menuTitleRender = (
  item: any,
  menuAddClick?: (pid?: string) => void,
  resourceModifyClick?: (id: string) => void,
  resourceRemoveClick?: (id: string) => void,
  hiddenTip?: boolean,
) => {
  return (
    <>
      <Tooltip placement="top" title={item.code} {...() => (hiddenTip ? { visible: false } : {})}>
        <span style={{ marginRight: '5px' }}>
          <Tag color="success" style={{ marginRight: '5px' }}>
            {parse('resource.menu')}
          </Tag>
          {isBlank(item.icon) ? null : (
            <CustomResourceIcon type={item.icon!!} style={{ marginRight: '5px' }} />
          )}
          {item.name}
        </span>
      </Tooltip>
      {menuAddClick && (
        <PlusOutlined style={{ color: '#409eff' }} onClick={() => menuAddClick(item.id)} />
      )}
      {(resourceModifyClick || resourceRemoveClick) && (
        <table style={{ float: 'right', width: '600px' }}>
          <tbody>
            <tr>
              <td style={{ width: '130px' }}>
                <Tooltip
                  placement="top"
                  title={`资源描述：${item.description}`}
                  {...() => (hiddenTip ? { visible: false } : {})}
                >
                  {item.description && <Tag color="magenta">{item.description}</Tag>}
                </Tooltip>
              </td>
              <td style={{ width: '130px' }}>
                {isBlank(item.path) ? null : (
                  <Tag
                    color="blue"
                    onClick={() =>
                      copy(item.path!!)
                        ? message.success(parse('resource.copy'))
                        : message.error(parse('resource.copyFail'))
                    }
                  >
                    {item.path}
                  </Tag>
                )}
              </td>
              <td style={{ width: '300px' }}>
                {isBlank(item.code) ? null : (
                  <Tag
                    color="geekblue"
                    onClick={() =>
                      copy(item.code!!)
                        ? message.success(parse('resource.copy'))
                        : message.error(parse('resource.copyFail'))
                    }
                  >
                    {item.code}
                  </Tag>
                )}
              </td>
              <td>{modifyOrDelete(item, resourceModifyClick, resourceRemoveClick)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

/**
 * 菜单项生成
 * @param menuItem
 * @param menuAddClick        新增按钮点击事件
 * @param resourceModifyClick 修改按钮点击事件
 * @param resourceRemoveClick 删除按钮点击事件
 * @param hiddenTip           隐藏code提示
 */

export const resourceMenuItemToTreeData = (
  menuItem: ResourceMenuItem,
  menuAddClick?: (pid?: string) => void,
  resourceModifyClick?: (id: string) => void,
  resourceRemoveClick?: (id: string) => void,
  hiddenTip?: boolean,
): DataNode => {
  const dataNode: DataNode = {
    id: menuItem.id!!,
    key: menuItem.id!!,
    code: menuItem.code,
    type: menuItem.type!!,
    sort: menuItem.sort,
    title: menuTitleRender(
      menuItem,
      menuAddClick,
      resourceModifyClick,
      resourceRemoveClick,
      hiddenTip,
    ),
  };
  const childrenNode = [] as DataNode[];
  if (!isBlank(menuItem.children)) {
    menuItem.children?.forEach((y) => {
      if (y.type === '0') {
        childrenNode.push(
          resourceMenuItemToTreeData(
            y,
            menuAddClick,
            resourceModifyClick,
            resourceRemoveClick,
            hiddenTip,
          ),
        );
      } else {
        childrenNode.push(
          resourceOperationActionsToTreeData(
            y,
            resourceModifyClick,
            resourceRemoveClick,
            hiddenTip,
          ),
        );
      }
    });
  }
  if (!isBlank(childrenNode)) {
    dataNode.children = childrenNode;
  }
  return dataNode;
};

/**
 * 资源渲染
 * @param resources           资源数组
 * @param menuAddClick        新增按钮点击事件
 * @param resourceModifyClick 修改按钮点击事件
 * @param resourceRemoveClick 删除按钮点击事件
 * @param hiddenTip           隐藏code提示
 */
export const resourceToTreeData = (
  resources: any[],
  menuAddClick?: (pid?: string) => void,
  resourceModifyClick?: (id: string) => void,
  resourceRemoveClick?: (id: string) => void,
  hiddenTip?: boolean,
): DataNode[] => {
  const dataNodes = resources.map((x) => {
    const dataNode: DataNode = {
      id: x.id!!,
      key: x.id!!,
      code: x.code,
      type: x.type!!,
      sort: x.sort,
      title: menuTitleRender(x, menuAddClick, resourceModifyClick, resourceRemoveClick, hiddenTip),
    };
    const children: DataNode[] = [];
    if (!isBlank(x.children)) {
      x.children?.forEach((y) => {
        if (y.type === '0') {
          children.push(
            resourceMenuItemToTreeData(
              y,
              menuAddClick,
              resourceModifyClick,
              resourceRemoveClick,
              hiddenTip,
            ),
          );
        } else {
          children.push(
            resourceOperationActionsToTreeData(
              y,
              resourceModifyClick,
              resourceRemoveClick,
              hiddenTip,
            ),
          );
        }
      });
    }
    dataNode.children = children;
    return dataNode;
  });
  return [
    {
      key: 'root',
      code: 'root',
      type: 'menu',
      title: (
        <>
          {parse('resource.menuTree')}
          {menuAddClick && (
            <PlusOutlined
              style={{ marginLeft: 10, color: '#409eff' }}
              onClick={() => menuAddClick()}
            />
          )}
        </>
      ),
      disableCheckbox: true,
      children: dataNodes,
    },
  ];
};
