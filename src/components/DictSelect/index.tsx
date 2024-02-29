import { DictSearchApi } from '@/services/DictSelect';
import { useRequest } from 'ahooks';
import { Select, Spin } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { LabeledValue, SelectValue } from 'antd/es/select';
import React, { FC, useEffect, useState } from 'react';

interface DictSelectProps {
  size?: SizeType;
  style?: React.CSSProperties;
  disabled?: boolean;
  id?: string;
  loading?: boolean;
  moreRes?: boolean; // 返回其他自定义字段值
  // 显示字典英文名称
  showEnglishName?: boolean;
  // 显示code-name
  showCodeAndName?: boolean;
  // 字典类型
  type: string;
  placeholder?: string | React.ReactNode;
  // 默认选择第一条数据
  defaultSelectTopOne?: boolean;
  // 禁止延迟加载数据 默认点击时加载
  disableLazyLoadingData?: boolean;
  defaultValue?: SelectValue;
  value?: SelectValue;
  // form表单监听使用, 编码一般使用onChange
  onSelected?: (value: SelectValue) => void;
  onChange?: (value: SelectValue | React.ReactNode) => void;
  // 是否返回选中对象key-value形式 默认true （提交数据格式：true时(默认)对象形式,false时只提交value）
  labelInValue?: boolean;
  // 回填到选择框的 Option 的属性值 true时为回填 value （仅控制显示回填：false（默认）返回name值，true返回value值）
  labelShowValue?: boolean;
  // 设置 Select 的模式为多选或标签
  mode?: 'multiple' | 'tags';
  searchParams?: string;
}

const DictSelect: FC<DictSelectProps> = (props) => {
  const [searchData, setSearchData] = useState<string>();
  const [currentData, setCurrentData] = useState<SelectValue>();
  const { data, loadMore, loading, loadingMore, noMore, run }: any = useRequest(
    (args: any) =>
      DictSearchApi({
        type: props.type,
        page: (args?.page || 0) + 1,
        searchData: props.searchParams ? props.searchParams : searchData || undefined,
        name: searchData || undefined,
      }),
    {
      // 是否组件初始化自动加载
      manual: !props.defaultSelectTopOne || props.disableLazyLoadingData,
      debounceInterval: 500,
      // @ts-ignore
      loadMore: true,
      // 搜索时始终为非最终项
      isNoMore: (d: any) => d.list.length >= d.totalElements && !searchData,
      formatResult: (
        res: HttpTableResult<any>,
      ): {
        list?: any[];
        totalElements?: number;
        page?: number;
      } => {
        if (res.ok) {
          return {
            list: res.body?.content || [],
            totalElements: res.body?.totalElements,
            page: res.body?.currentPage,
          };
        }
        return { list: [] };
      },
    },
  );

  const onChange = (value: any) => {
    setCurrentData(value);
    if (props.onChange) {
      if (props.moreRes) {
        const currArr = data.list.filter((res: any) => res.code == value.value)[0];
        value['number'] = currArr.number;
      }
      props.onChange(value);
    }
  };

  useEffect(() => {
    // 默认选择第一条
    if (props.defaultSelectTopOne && data.page === 1) {
      if (data && data?.list?.length > 0) {
        const selectItem: any = data.list[0];
        const firstValue: SelectValue =
          props.labelInValue === false
            ? selectItem.code
            : {
                key: selectItem.code,
                value: selectItem.code,
                label: selectItem.name,
              };
        onChange(firstValue);
      }
    }
  }, [data]);

  // 计算默认值
  const renderValue = (value?: any): SelectValue | undefined => {
    // 表单中受控的默认值
    if (value) {
      if (props.showCodeAndName) {
        return value.key + ' - ' + value.label;
      } else {
        return value;
      }
    }
    // 组件提供默认值
    if (props.defaultValue) {
      return props.defaultValue;
    }
    return currentData;
  };

  const options = (data?.list || []).map((x: any) => (
    <Select.Option key={x.code} title={x.name} value={x.code}>
      {props.showCodeAndName ? `${x.code}-${x.name}` : x.name}
    </Select.Option>
  ));

  return (
    <Select
      optionLabelProp={props.labelShowValue ? 'value' : 'title'}
      id={props.id}
      disabled={props.disabled}
      style={props.style}
      size={props.size}
      loading={loading || loadingMore}
      value={renderValue(props.value)}
      placeholder={props.placeholder || '请选择'}
      labelInValue={props.labelInValue !== false}
      filterOption={false}
      onClick={() => {
        if ((data?.list.length === 0 && !data?.page) || searchData) {
          setSearchData(undefined);
          run({ page: 0 });
        }
      }}
      onChange={(e) => {
        const value = e as LabeledValue;
        // 受控组件回调
        onChange(value);
        if (props.onSelected) {
          props.onSelected(e as LabeledValue);
        }
      }}
      // 滚动状态监听
      onPopupScroll={(e: any) => {
        e.persist();
        const { target } = e;
        if (parseInt((target.scrollTop + target.offsetHeight).toFixed(0)) >= target.scrollHeight) {
          if (!noMore) {
            loadMore();
          }
        }
      }}
      notFoundContent={
        loading || (data?.list.length === 0 && !data?.page && !searchData) ? (
          <div style={{ textAlign: 'center' }}>
            <Spin delay={100} spinning tip="加载中, 请稍后..." />
          </div>
        ) : undefined
      }
      onSearch={(e) => {
        setSearchData(e);
        run({ page: 0 });
      }}
      showSearch
      allowClear
      mode={props.mode}
    >
      {options}
    </Select>
  );
};

export default DictSelect;
