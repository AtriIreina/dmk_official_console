//TODO: 1.修改数据类型
export type TableListItem = {
  id: number;
  level: number;
  name: string;
  franchiseFee: number;
  bonusPoints: number;
  productSubsidies: number;
  transactionAllowance: number;
  isSupportDividends: number;
  shoppingAllowance: number;
  rehabilitationCare: number;
  travelCare: number;
  illnessCare: number;
  accidentCare: number;
  healthyCare: number;
  happyCare: number;
  icon: string;
  status: number;
  isDeleted: number;
  createTime: string;
  updateTime: string;
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
