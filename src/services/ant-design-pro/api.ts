// @ts-ignore
/* eslint-disable */
import { log } from 'lodash-decorators/utils';
// import { request } from 'umi';
import request from 'umi-request';
import {
  setItemWithExpiration as setStorage,
  getItemWithExpiration as getStorage,
  removeItem,
  getItemWithExpiration,
} from '../../utils/localStorageUtil';
import { message } from 'antd';
import { Redirect } from 'react-router';

//TODO: request拦截器 (改变url 或 options) 设置全局Bearer Token
request.interceptors.request.use((url, options) => {
  // let access = getStorage('access');
  // console.log('interceptors-access:', access);
  // if (null != access) {
  //   access = '';
  //const authHeader = { Authorization: `Bearer ${access}` };
  let token = '';
  if (getStorage('token') != null) {
    token = 'bearer ' + getStorage('token');
  }
  // console.log('token:', getStorage('token'));
  const authHeader = {
    'Content-Type': 'application/json',
    //TODO:这里有坑,如果过期token未被删除,但页面又重定向到登录页面,会导致无法请求校验码
    Authorization: token,
  };
  console.log('authHeader:', authHeader);
  return {
    url: url,
    options: { ...options, interceptors: true, headers: authHeader },
  };
  // }
  // return {
  //   url: url,
  //   options: { ...options, interceptors: true },
  // };
});

// TODO: DO 获取当前用户 GET /api/currentUser
export async function currentUser(options?: { [key: string]: any }) {
  // return request<{
  //   data: API.CurrentUser;
  // }>('/api/currentUser', {
  //   method: 'GET',
  //   ...(options || {}),
  // });
  // name: 'Serati Ma',
  // avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  // userid: '00000001',
  const avatar = 'https://picx.zhimg.com/v2-a9c966774c2d1f924a3ffe3fb85db199_1440w.jpg';
  const token = getStorage('token'); // 获取数据，如果未过期则返回数据，否则返回 null
  let username;
  let userId;
  const result = await request('/api/auth/whoami');
  if (result.code == 0) {
    username = result.result.username;
    userId = result.result.id;
    const msg = {
      data: {
        name: username,
        avatar: avatar,
        userid: userId,
        ...result.result,
      },
    };
    setStorage('user', msg.data, 3600 * 6); // 存储数据并设置过期时间为 6 小时
    return msg;
  } else if (result.error_description == 'Access token expired') {
    message.error('用户登录超时, 请重新登陆');
    location.replace('/');
  }
  return null;
}

// TODO: DO 退出登录接口 POST /api/login/outLogin
export async function outLogin(options?: { [key: string]: any }) {
  const userId = getStorage('user').id;
  const result = await request<Record<string, any>>('/api/system/loginCenter/logout/' + userId, {
    method: 'GET',
    ...(options || {}),
  });
  if (result.code == 0) {
    message.info('已退出登录');
    removeItem('token');
    removeItem('user');
  } else {
    message.info(result.msg);
  }
}

//TODO: DO 图像验证码
/** 登录接口 POST /api/login/account */
export async function captcha(body: API.CheckCodeParams, options?: { [key: string]: any }) {
  // return request<API.LoginResult>('/api/login/account', {
  return request<API.LoginResult>('/api/system/loginCenter/getCheckCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: '',
    },
    data: body,
    ...(options || {}),
  });
}

//TODO: DO 登录接口
/** 登录接口 POST /api/login/account */
// export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  console.log('login:', body, options);
  let checkCodeDto = body?.checkCodeDto;
  //TODO: DO checkCodeType需要动态
  checkCodeDto.checkCodeType = 1;
  const data = {
    checkCodeDto: checkCodeDto,
    user: {
      username: body?.username,
      password: body?.password,
    },
  };
  console.log('data:', data);
  // return request<API.LoginResult>('/api/system/loginCenter/login', {
  // return request<API.LoginResult>('/api/login/account', {
  // return request<API.LoginResult>('/api/login/account2', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   data: data,
  // });

  const result = await request<API.LoginResult>('/api/system/loginCenter/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  });
  console.log('result:', result);
  console.log('result.code == 0:', result.code == 0);
  //是否请求成功
  if (result.code == 0) {
    //是否为普通用户
    const roleList = result.result.roleList;
    console.log('roleList:', roleList<string[]>);
    // for(let i : roleList){
    //   console.log(roleList[i]);
    // }
    roleList.forEach((element: string) => {
      console.log(element);
    });
    console.log(
      'roleList.size() == 0 || (roleList.length == 1 && roleList[0]',
      roleList.length == 0 || (roleList.length == 1 && roleList[0] == 'user'),
    );
    if (roleList.length == 0 || (roleList.length == 1 && roleList[0] == 'user')) {
      console.log('没有管理员权限');
      message.error('没有管理员权限');
      return null;
    }
    console.log('token:', result.result.token);
    setStorage('token', result.result.token, 3600 * 6); // 存储数据并设置过期时间为 6 小时
    return result;
  } else {
    message.error(result.msg);
    return null;
  }
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
