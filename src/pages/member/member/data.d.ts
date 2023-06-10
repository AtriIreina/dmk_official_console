// export type TableListItem = {
//   key: number;
//   disabled?: boolean;
//   href: string;
//   avatar: string;
//   name: string;
//   owner: string;
//   desc: string;
//   callNo: number;
//   status: string;
//   updatedAt: Date;
//   createdAt: Date;
//   progress: number;
// };

//TODO: 修改数据类型
export type TableListItem = {
  id: number;
  userId: number;
  pid: number;
  nickname: string;
  realname: string;
  avatar: string;
  points: number;
  balance: number;
  frozenPoints: number;
  frozenBalance: number;
  totalConsume: number;
  memberLevelId: number;
  province: number;
  city: number;
  area: number;
  addressDetail: string;
  status: number;
  banDays: number;
  isDeleted: boolean;
  createTime: Date;
  updateTime: Date;
  createUser: number;
  updateUser: number;
  // uuid: string;
  // username: string;
  // password: string;
  // salt: string;
  birthday: date;
  sex: number;
  email: string;
  phone: string;
  idcard: string;
  introduction: string;
  // payPassword: string;
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
