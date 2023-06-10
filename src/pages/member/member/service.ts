// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from './data';
import e from 'express';

//TODO: 查 POST /api/system/member/list
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
  }>('/api/system/member/page', {
    headers: {
      'Content-Type': 'application/json',
      // Authorization:
      //   'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZG1rLXJlc291cmNlIl0sInVzZXJfbmFtZSI6IntcImlkXCI6MTMsXCJpc0RlbGV0ZWRcIjowLFwicGVybWlzc2lvbnNcIjpbXCJjbnRfYWdlbnRcIixcIm9wZV9saW5rXCIsXCJvcGVfd2Vic2l0ZVwiLFwic3lzX21lbWJlclwiLFwic3lzX21lbWJlcl9sZXZlbFwiLFwic3lzX21lbnVcIixcInN5c19wZXJtaXNzaW9uXCIsXCJzeXNfcm9sZVwiLFwic3lzX3VzZXJcIixcInN5c191c2VyX3JvbGVcIixcImNudF9hcnRpY2xlXCIsXCJjbnRfYXJ0aWNsZV90eXBlXCIsXCJjbnRfY29sdW1uXCIsXCJjbnRfZ29vZHNcIixcImNudF9nb29kc190eXBlXCIsXCJjbnRfbWVyY2hhbnRcIixcIm9wZV9jYXJvdXNlbFwiLFwib3BlX2Nhcm91c2VsX3R5cGVcIl0sXCJzdGF0dXNcIjoxLFwidXNlcm5hbWVcIjpcImF1dGhcIixcInVzZXJzYWx0XCI6XCIxMjM0XCJ9Iiwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTY4NDU4MzIwNiwiYXV0aG9yaXRpZXMiOlsic3lzX3Blcm1pc3Npb24iLCJjbnRfYWdlbnQiLCJzeXNfbWVtYmVyIiwiY250X2dvb2RzIiwiY250X2NvbHVtbiIsImNudF9hcnRpY2xlIiwic3lzX3JvbGUiLCJvcGVfd2Vic2l0ZSIsInN5c191c2VyX3JvbGUiLCJzeXNfbWVudSIsInN5c191c2VyIiwiY250X2FydGljbGVfdHlwZSIsIm9wZV9saW5rIiwiY250X21lcmNoYW50Iiwib3BlX2Nhcm91c2VsIiwic3lzX21lbWJlcl9sZXZlbCIsImNudF9nb29kc190eXBlIiwib3BlX2Nhcm91c2VsX3R5cGUiXSwianRpIjoiUFJRZDEwVW5IWDBBMGExTVRTanZncVRyUHpBIiwiY2xpZW50X2lkIjoiRE1LV2ViQXBwIn0.SbuZoTZJLXpr0EgRF29kFBga1m3wcs19oYimQNjrib0',
    },
    method: 'POST',
    body: JSON.stringify({
      pageParams: params,
      filter: { ...options },
    }),
  });
  return result;
}

//TODO: 查 GET /api/system/member/getByUserId
export async function getByUserId(params: { userId: number }) {
  const result = request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/system/member/getByUserId', {
    method: 'GET',
    params: {
      ...params,
    },
  });
  return result;
}

//TODO: 改 PUT /api/system/member/update
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/system/member/update/', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
  //没有批量删除
  // if (data) {
  // return request<TableListItem>('/api/system/member/update/', {
  //   data,
  //   method: 'PUT',
  //   ...(options || {}),
  // });
  // } else {
  //   return request<TableListItem>('/api/system/member/batchUpdate', {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     method: 'PUT',
  //     body: JSON.stringify(data.key),
  //     ...(options || {}),
  //   });
  // }
}

//TODO: 增 POST /api/system/member/save
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/system/member/save', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

//TODO: 删 DELETE /api/system/member/remove removeBatch */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  console.log(data);
  console.log(data.key);
  console.log(data.key.length);
  if (data.key.length == 1) {
    return request<Record<string, any>>('/api/system/member/remove/' + data.key[0], {
      data,
      method: 'DELETE',
      ...(options || {}),
    });
  } else {
    return request<Record<string, any>>('/api/system/member/removeBatch', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify(data.key),
      ...(options || {}),
    });
  }
}
