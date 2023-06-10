import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="内容建设中, 请耐心等待"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回
      </Button>
    }
  />
);

export default NoFoundPage;
