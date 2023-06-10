//TODO: 1.修改数据类型
export type TableListItem = {
  id: number;
  level: number;
  name: string;
  isSupportTwoDomain: number;
  shopCount: number;
  isGiveOneDomain: number;
  imageSpaceCapacity: number;
  isShopRecommend: number;
  isSupportBasic: number;
  isSupportTraining: number;
  isLimitProductCount: number;
  isSupportOnlineService: number;
  isSupportMapLabel: number;
  isSupportReviseLogo: number;
  isSupportReviseSign: number;
  isSupportSlideshow: number;
  isLimitStyleCount: number;
  isFreeCertified: number;
  isFreePromotion: number;
  isFreeMobileShop: number;
  isFreeWechatWebsite: number;
  isFreeOnebyoneService: number;
  settlePrice: number;
  icon: string;
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
