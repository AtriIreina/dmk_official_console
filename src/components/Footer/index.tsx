import { useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    // defaultMessage: '蚂蚁集团体验技术部出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'DMK Official',
          title: '到门口 (官网)',
          href: 'https://www.daomenkou.cn/index.html',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/atriireina/dmk_official',
          blankTarget: true,
        },
        {
          key: 'DMK Commerce',
          title: '到门口 (电商)',
          href: 'https://www.daomenkou.cn/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
