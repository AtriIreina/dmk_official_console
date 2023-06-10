export default [
  //TODO: WAIT 修改路由
  // {
  //   name: '控制台',
  //   path: '/console',
  //   icon: 'smile',
  //   component: './dashboard/analysis',
  // },
  {
    name: '发布新闻',
    path: '/publish',
    icon: 'smile',
    component: './content/publish',
    access: 'role_editor',
  },
  // {
  //   name: '上传图片',
  //   path: '/upload',
  //   icon: 'smile',
  //   component: './content/upload',
  // },
  //TODO:图片管理
  // {
  //   name: '图片管理',
  //   path: '/media',
  //   icon: 'smile',
  //   component: './content/media',
  //   routes: [
  //     // {
  //     //   name: '新闻图片',
  //     //   icon: 'smile',
  //     //   path: '/content/media/articles',
  //     //   component: '/content/media/articles',
  //     // },
  //   ],
  // },
  {
    name: '内容管理',
    path: '/content',
    icon: 'smile',
    access: 'role_editor',
    routes: [
      {
        path: '/content',
        redirect: '/content/article',
      },
      // {
      //   name: '商品管理',
      //   path: '/content/goods',
      //   // component: './content/goods',
      // access: 'cnt_goods',
      // },
      // {
      //   name: '商品分类',
      //   path: '/content/goods-type',
      //   // component: './content/goods-type',
      // access: 'cnt_goods_type',
      // },
      {
        name: '新闻管理',
        path: '/content/article',
        component: './content/article',
        access: 'cnt_article',
      },
      {
        name: '新闻类型',
        path: '/content/article-type',
        component: './content/article-type',
        access: 'cnt_article_type',
      },
      {
        name: '首页栏目管理',
        path: '/content/column',
        component: './content/column',
        access: 'cnt_column',
      },
      {
        name: '代理优惠政策',
        path: '/content/agent',
        component: './content/agent',
        access: 'cnt_agent',
      },
      {
        name: '商户入驻政策',
        path: '/content/merchant',
        component: './content/merchant',
        access: 'cnt_amerchant',
      },
    ],
  },
  {
    path: '/operate',
    name: '运营管理',
    icon: 'smile',
    access: 'role_manager',
    routes: [
      {
        path: '/operate',
        redirect: '/operate/website',
      },
      {
        name: '网站配置',
        path: '/operate/website',
        component: './operate/website',
        access: 'ope_website',
      },
      {
        name: '轮播图管理',
        path: '/operate/carousel',
        component: './operate/carousel',
        access: 'ope_carousel',
      },
      {
        name: '轮播图类型',
        path: '/operate/carousel-type',
        component: './operate/carousel-type',
        access: 'ope_carousel_type',
      },
      {
        name: '友情链接管理',
        path: '/operate/links',
        component: './operate/links',
        access: 'ope_link',
      },
      {
        name: '电话回访列表',
        path: '/operate/contact',
        component: './operate/contact',
        access: 'ope_contact',
      },
      {
        name: '关于我们',
        path: '/operate/about',
        component: './operate/about',
        access: 'ope_about',
      },
      {
        name: '七大模块页面管理',
        path: '/operate/module7',
        component: './operate/module7',
        access: 'ope_about',
      },
    ],
  },
  {
    path: '/member',
    name: '会员管理',
    icon: 'smile',
    access: 'role_admin',
    routes: [
      {
        path: '/member',
        redirect: '/member/user',
      },
      {
        name: '用户管理',
        path: '/member/user',
        component: './member/user',
        access: 'sys_user',
      },
      {
        name: '用户详情管理',
        path: '/member/member',
        component: './member/member',
        access: 'sys_member',
      },
      {
        name: '会员等级管理',
        path: '/member/member-level',
        component: './member/member-level',
        access: 'sys_member_level',
      },
    ],
  },
  {
    path: '/perm',
    name: '权限管理',
    icon: 'smile',
    access: 'role_super',
    routes: [
      {
        path: '/perm',
        redirect: '/perm/role',
      },
      {
        name: '用户角色管理',
        path: '/perm/role',
        component: './noExist',
        // component: './perm/role',
        access: 'sys_role',
      },
      {
        name: '用户权限管理',
        path: '/perm/permission',
        component: './noExist',
        // component: './perm/permission',
        access: 'sys_permission',
      },
      {
        name: '系统菜单管理',
        path: '/perm/menu',
        component: './noExist',
        // component: './perm/menu',
        access: 'sys_menu',
      },
    ],
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: '404',
      },
    ],
  },
  //dashboard
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   icon: 'dashboard',
  //   routes: [
  //     {
  //       path: '/dashboard',
  //       redirect: '/dashboard/analysis',
  //     },
  //     {
  //       name: 'analysis',
  //       icon: 'smile',
  //       path: '/dashboard/analysis',
  //       component: './dashboard/analysis',
  //     },
  //     {
  //       name: 'monitor',
  //       icon: 'smile',
  //       path: '/dashboard/monitor',
  //       component: './dashboard/monitor',
  //     },
  //     {
  //       name: 'workplace',
  //       icon: 'smile',
  //       path: '/dashboard/workplace',
  //       component: './dashboard/workplace',
  //     },
  //   ],
  // },
  //form
  // {
  //   path: '/form',
  //   icon: 'form',
  //   name: 'form',
  //   routes: [
  //     {
  //       path: '/form',
  //       redirect: '/form/basic-form',
  //     },
  //     {
  //       name: 'basic-form',
  //       icon: 'smile',
  //       path: '/form/basic-form',
  //       component: './form/basic-form',
  //     },
  //     {
  //       name: 'step-form',
  //       icon: 'smile',
  //       path: '/form/step-form',
  //       component: './form/step-form',
  //     },
  //     {
  //       name: 'advanced-form',
  //       icon: 'smile',
  //       path: '/form/advanced-form',
  //       component: './form/advanced-form',
  //     },
  //   ],
  // },
  //list
  // {
  //   path: '/list',
  //   icon: 'table',
  //   name: 'list',
  //   routes: [
  //     {
  //       path: '/list/search',
  //       name: 'search-list',
  //       component: './list/search',
  //       routes: [
  //         {
  //           path: '/list/search',
  //           redirect: '/list/search/articles',
  //         },
  //         {
  //           name: 'articles',
  //           icon: 'smile',
  //           path: '/list/search/articles',
  //           component: './list/search/articles',
  //         },
  //         {
  //           name: 'projects',
  //           icon: 'smile',
  //           path: '/list/search/projects',
  //           component: './list/search/projects',
  //         },
  //         {
  //           name: 'applications',
  //           icon: 'smile',
  //           path: '/list/search/applications',
  //           component: './list/search/applications',
  //         },
  //       ],
  //     },
  //     {
  //       path: '/list',
  //       redirect: '/list/table-list',
  //     },
  //     {
  //       name: 'table-list',
  //       icon: 'smile',
  //       path: '/list/table-list',
  //       component: './list/table-list',
  //     },
  //     {
  //       name: 'basic-list',
  //       icon: 'smile',
  //       path: '/list/basic-list',
  //       component: './list/basic-list',
  //     },
  //     {
  //       name: 'card-list',
  //       icon: 'smile',
  //       path: '/list/card-list',
  //       component: './list/card-list',
  //     },
  //   ],
  // },
  //profile
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   icon: 'profile',
  //   routes: [
  //     {
  //       path: '/profile',
  //       redirect: '/profile/basic',
  //     },
  //     {
  //       name: 'basic',
  //       icon: 'smile',
  //       path: '/profile/basic',
  //       component: './profile/basic',
  //     },
  //     {
  //       name: 'advanced',
  //       icon: 'smile',
  //       path: '/profile/advanced',
  //       component: './profile/advanced',
  //     },
  //   ],
  // },
  //result
  // {
  //   name: 'result',
  //   icon: 'CheckCircleOutlined',
  //   path: '/result',
  //   routes: [
  //     {
  //       path: '/result',
  //       redirect: '/result/success',
  //     },
  //     {
  //       name: 'success',
  //       icon: 'smile',
  //       path: '/result/success',
  //       component: './result/success',
  //     },
  //     {
  //       name: 'fail',
  //       icon: 'smile',
  //       path: '/result/fail',
  //       component: './result/fail',
  //     },
  //   ],
  // },
  //exception
  // {
  //   name: 'exception',
  //   icon: 'warning',
  //   path: '/exception',
  //   routes: [
  //     {
  //       path: '/exception',
  //       redirect: '/exception/403',
  //     },
  //     {
  //       name: '403',
  //       icon: 'smile',
  //       path: '/exception/403',
  //       component: './exception/403',
  //     },
  //     {
  //       name: '404',
  //       icon: 'smile',
  //       path: '/exception/404',
  //       component: './exception/404',
  //     },
  //     {
  //       name: '500',
  //       icon: 'smile',
  //       path: '/exception/500',
  //       component: './exception/500',
  //     },
  //   ],
  // },
  //account
  // {
  //   name: 'account',
  //   icon: 'user',
  //   path: '/account',
  //   routes: [
  //     {
  //       path: '/account',
  //       redirect: '/account/center',
  //     },
  //     {
  //       name: 'center',
  //       icon: 'smile',
  //       path: '/account/center',
  //       component: './account/center',
  //     },
  //     {
  //       name: 'settings',
  //       icon: 'smile',
  //       path: '/account/settings',
  //       component: './account/settings',
  //     },
  //   ],
  // },
  //editor
  // {
  //   name: 'editor',
  //   icon: 'highlight',
  //   path: '/editor',
  //   routes: [
  //     {
  //       path: '/editor',
  //       redirect: '/editor/flow',
  //     },
  //     {
  //       name: 'flow',
  //       icon: 'smile',
  //       path: '/editor/flow',
  //       component: './editor/flow',
  //     },
  //     {
  //       name: 'mind',
  //       icon: 'smile',
  //       path: '/editor/mind',
  //       component: './editor/mind',
  //     },
  //     {
  //       name: 'koni',
  //       icon: 'smile',
  //       path: '/editor/koni',
  //       component: './editor/koni',
  //     },
  //   ],
  // },
  {
    path: '/',
    redirect: '/content/article',
    access: 'testAdmin',
  },
  {
    component: '404',
  },
];
