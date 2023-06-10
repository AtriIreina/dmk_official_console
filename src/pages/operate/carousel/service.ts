// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from './data';
import e from 'express';

//TODO: 3.查 POST /api/operate/carousel/list
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
  console.log('operate-carousel-rule:', params, options);
  const result = request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/operate/carousel/page', {
    // }>('/api/content/article/page', {
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

//TODO: 3.改 PUT /api/operate/carousel/update
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/operate/carousel/update/', {
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

//TODO: 3.增 POST /api/operate/carousel/save
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/operate/carousel/save', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

//TODO: 3.删 DELETE /api/operate/carousel/remove removeBatch */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  console.log(data);
  console.log(data.key);
  console.log(data.key.length);
  if (data.key.length == 1) {
    return request<Record<string, any>>('/api/operate/carousel/remove/' + data.key[0], {
      data,
      method: 'DELETE',
      ...(options || {}),
    });
  } else {
    return request<Record<string, any>>('/api/operate/carousel/removeBatch', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify(data.key),
      ...(options || {}),
    });
  }
}
