import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  // 关闭国际化 (设置无效)
  menu: {
    locale: false,
  },
  title: '到门口官网-后台管理系统',
  pwa: false,
  logo: 'https://s1.ax1x.com/2023/06/01/p9zPxbQ.png',
  iconfontUrl: '',
};

export default Settings;
