/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  //TODO:权限控制
  const { currentUser } = initialState ?? {};
  const userRole = currentUser?.userRole;
  const permissions = currentUser?.permissions;
  console.log('initialState:', initialState);
  console.log('currentUser:', currentUser);
  console.log('userRole:', userRole);
  console.log('permissions:', permissions);
  console.log('sys_user_role:', permissions && permissions.indexOf('cnt_agent') != -1);
  return {
    // 全局
    canRead: true,
    canUpdate: currentUser && currentUser.access === 'admin',
    canDelete: currentUser && currentUser.access === 'admin',
    canAdmin: currentUser && currentUser.access === 'admin',
    // 角色
    role_super: userRole && userRole.indexOf('super') != -1,
    role_admin: userRole && (userRole.indexOf('super') != -1 || userRole.indexOf('admin') != -1),
    role_manager:
      userRole &&
      (userRole.indexOf('super') != -1 ||
        userRole.indexOf('admin') != -1 ||
        userRole.indexOf('manager') != -1),
    role_editor:
      userRole &&
      (userRole.indexOf('super') != -1 ||
        userRole.indexOf('admin') != -1 ||
        userRole.indexOf('manager') != -1 ||
        userRole.indexOf('editor') != -1),
    role_user:
      userRole &&
      (userRole.indexOf('super') != -1 ||
        userRole.indexOf('admin') != -1 ||
        userRole.indexOf('manager') != -1 ||
        userRole.indexOf('editor') != -1 ||
        userRole.indexOf('user') != -1),
    // 权限
    cnt_agent: permissions && permissions.indexOf('cnt_agent') != -1,
    cnt_article: permissions && permissions.indexOf('cnt_article') != -1,
    cnt_article_type: permissions && permissions.indexOf('cnt_article_type') != -1,
    cnt_column: permissions && permissions.indexOf('cnt_column') != -1,
    cnt_goods: permissions && permissions.indexOf('cnt_goods') != -1,
    cnt_goods_type: permissions && permissions.indexOf('cnt_goods_type') != -1,
    cnt_merchant: permissions && permissions.indexOf('cnt_merchant') != -1,
    ope_carousel: permissions && permissions.indexOf('ope_carousel') != -1,
    ope_carousel_type: permissions && permissions.indexOf('ope_carousel_type') != -1,
    ope_link: permissions && permissions.indexOf('ope_link') != -1,
    ope_website: permissions && permissions.indexOf('ope_website') != -1,
    sys_member: permissions && permissions.indexOf('sys_member') != -1,
    sys_member_level: permissions && permissions.indexOf('sys_member_level') != -1,
    sys_menu: permissions && permissions.indexOf('sys_menu') != -1,
    sys_permission: permissions && permissions.indexOf('sys_permission') != -1,
    sys_role: permissions && permissions.indexOf('sys_role') != -1,
    sys_user: permissions && permissions.indexOf('sys_user') != -1,
    sys_user_role: permissions && permissions.indexOf('sys_user_role') != -1,
  };
}
