import { message } from 'antd';

const handleRequest = async (customRequest, successTips) => {
  const hide = message.loading('网络请求中');

  try {
    const result = await customRequest;
    hide();
    if (result.code == 0 && result.successful == true) {
      message.success(successTips);
      return true;
    } else {
      message.error(result.msg);
      return false;
    }
  } catch (error) {
    hide();
    message.error('网络请求失败');
    return false;
  }
};

export default handleRequest;
