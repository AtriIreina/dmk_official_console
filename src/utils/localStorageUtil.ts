// 存储数据到 localStorage，并设置过期时间为 1 小时
export function setItemWithExpiration(key: string, value: string, expiration: number) {
  const item = {
    value: value,
    expiration: new Date().getTime() + expiration * 1000, // 计算过期时间戳
  };
  localStorage.setItem(key, JSON.stringify(item));
}

// 从 localStorage 中获取数据，同时检查是否过期
export function getItemWithExpiration(key: string) {
  const item = JSON.parse(localStorage.getItem(key));
  if (item && new Date().getTime() < item.expiration) {
    return item.value;
  }
  return null; // 数据过期或不存在
}

export function removeItem(key: string) {
  localStorage.removeItem(key);
  return null; // 数据过期或不存在
}
