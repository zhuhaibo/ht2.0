import styles from '../style.less';
import { Space, Dropdown } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import i18n from 'i18next';
import { useState } from 'react';
import { defaultLanguage } from '@/ConfigSystemSettings';
import { useCommonStore } from '@/hooks';
const langs = localStorage.getItem('lang');
const lng = langs ? langs : defaultLanguage;
const languageItems: any = [ 
  { key: 'zh-CN', label: '中文' }, 
  { key: 'en-US', label: 'English' },
];

export default function(){
  const { commonState, set } = useCommonStore();
  const [lang, setLang] = useState(languageItems.filter((res: any)=>res.key === lng)[0]?.label || 'English');

  // 国际化切换
  const languageClick = ({ domEvent, key }: any) => {
    localStorage.setItem('lang', key);
    setLang(domEvent.target.innerText);
    set({...commonState, lang: key});
    i18n.changeLanguage(key);
  };
  
  return (
    <Dropdown menu={{ items: languageItems, onClick: languageClick }}>
      <div className={styles.language}>
        <Space>
          <GlobalOutlined /> 
          {lang}
        </Space>
      </div>
    </Dropdown>
  )
}