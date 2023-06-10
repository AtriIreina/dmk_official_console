import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import NoticeIconView from '../NoticeIcon';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="到门口"
        options={[
          {
            label: <a href="/">到门口</a>,
            value: '到门口',
          },
          {
            label: <a href="/">慧奈美</a>,
            value: '慧奈美',
          },
          {
            label: <a href="/">助花</a>,
            value: '助花',
          },
        ]}
        onSearch={(value) => {
          console.log('input', value);
        }}
      />
      <span
        className={styles.action}
        onClick={() => {
          // window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span>
      {/* <NoticeIconView /> */}
      <Avatar menu />
      {/* 关闭语言选取 */}
      {/* <SelectLang className={styles.action} /> */}
    </Space>
  );
};

export default GlobalHeaderRight;
