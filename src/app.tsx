import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
// import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';

//TODO:全局导入getStorage
import {
  setItemWithExpiration as setStorage,
  getItemWithExpiration as getStorage,
  removeItem,
  getItemWithExpiration,
} from './utils/localStorageUtil';

import QuickUpload from '@/components/QuickUpload';

/**
 * 在构建时是无法使用 dom 的，所以有些配置可能需要运行时来配置
 * 一般而言我们都是在 src/app.tsx 中管理运行时配置。
 */

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * initialStateConfig 是 getInitialState 的补充配置
 */
/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * getInitialState 用于获取初始化数据，
 * 初始化数据使用 useModel 在各个组件中使用，
 * 在请求中 getInitialState 会堵塞页面加载。
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    console.log('getInitialState');
    try {
      const msg = await queryCurrentUser();
      console.log('getInitialState:', msg);
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  //TODO: 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
  return {};
}

/**
 * 在构建时是无法使用 dom 的，所以有些配置可能需要运行时来配置，我们可以在src/app.tsx 中 export 一个 layout 来进行配置
 * layout 支持一个 function，可以与 initialState 结合使用，将动态数据放入 initialState 中每次 initialState 变化都会触发更新。
 */
// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      //TODO: 表单水印
      // content: initialState?.currentUser?.name,
      content: 'Ireina',
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      //TODO: 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          // <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          //   <LinkOutlined />
          //   <span>OpenAPI 文档</span>
          // </Link>,
          // <Link to="/~docs" key="docs">
          //   <BookOutlined />
          //   <span>业务组件文档</span>
          // </Link>,
          <Link>
            <LinkOutlined />
            <span>预留按钮1</span>
          </Link>,
          <Link>
            <BookOutlined />
            <span>预留按钮2</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,

    // 自定义 403 页面
    unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态

    // 关闭 面板设置按钮 (只用于开发阶段选取面板风格)
    childrenRender: (children, props) => {
      if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )} */}
          {/* TODO:全局挂载组件 */}
          <QuickUpload />
        </>
      );
    },
    ...initialState?.settings,
  };
};
