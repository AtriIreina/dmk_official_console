// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from './data';
import { ValueItemType } from './data';
import e from 'express';

//TODO: 3.查 POST /api/operate/about/list
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
  const result = request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/operate/about/page', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      pageParams: params,
      filter: { ...options },
    }),
  });
  return result;
}

//TODO: 3.修改 新增配置项 POST /api/operate/about/update/addItem
export async function addItem(data: ValueItemType) {
  return request<TableListItem>('/api/operate/about/update/addItem', {
    data,
    method: 'PUT',
  });
}

//TODO: 3.修改 修改配置项 PUT /api/operate/about/update/alterItem
export async function alterItem(data: ValueItemType) {
  return request<TableListItem>('/api/operate/about/update/alterItem', {
    data,
    method: 'PUT',
  });
}

//TODO: 3.修改 删除配置项 PUT /api/operate/about/update/alterItem
export async function deleteItem(data: ValueItemType) {
  return request<TableListItem>('/api/operate/about/update/deleteItem', {
    data,
    method: 'PUT',
  });
}

//TODO: 3.改 PUT /api/operate/about/update
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/operate/about/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
  //没有批量删除
  // if (data) {
  // return request<TableListItem>('/api/member/update/', {
  //   data,
  //   method: 'PUT',
  //   ...(options || {}),
  // });
  // } else {
  //   return request<TableListItem>('/api/member/batchUpdate', {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     method: 'PUT',
  //     body: JSON.stringify(data.key),
  //     ...(options || {}),
  //   });
  // }
}

//TODO: 3.增 POST /api/operate/about/save
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/operate/about/save', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

//TODO: 3.删 DELETE /api/operate/about/remove removeBatch */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  console.log(data);
  console.log(data.key);
  console.log(data.key.length);
  if (data.key.length == 1) {
    return request<Record<string, any>>('/api/operate/about/remove/' + data.key[0], {
      data,
      method: 'DELETE',
      ...(options || {}),
    });
  } else {
    return request<Record<string, any>>('/api/operate/about/removeBatch', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify(data.key),
      ...(options || {}),
    });
  }
}
