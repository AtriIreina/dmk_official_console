//TODO: 修改数据类型
export type TableListItem = {
  id: number;
  name: string;
  level: string;
  periodDays: number;
  icon: string;
  pointsThreshold: number;
  consumeThreshold: number;
  status: number;
  isDeleted: number;
  createTime: Date;
  updateTime: Date;
  createUser: number;
  updateUser: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};