/**
 * @description 登录、获取用户信息、退出登录、清除token逻辑，不建议修改
 */
import { useAclStore } from './acl';
import { useRoutesStore } from './routes';
import { useSettingsStore } from './settings';
import { useTabsStore } from './tabs';
import { getCurrentUserInfo, login, logout } from '/@/api/user';
import { storage, tokenName } from '/@/config';
import { getToken, removeToken, setToken } from '/@/utils/token';
import { isArray, isString } from '/@/utils/validate';
import { gp } from '/@vab/plugins/vab';

export const useUserStore = defineStore('user', {
  state: (): UserModuleType => ({
    token: getToken() as string,
    username: '游客',
    avatar: './static/svg/avatar.svg',
    roleList: [],
    teamList: [],
  }),
  getters: {
    getToken: state => state.token,
    getUsername: state => state.username,
    getAvatar: state => state.avatar,
  },
  actions: {
    /**
     * @description 设置token
     * @param {*} token
     */
    setToken(token: string) {
      this.token = token;
      setToken(token);
    },
    /**
     * @description 设置用户名
     * @param {*} username
     */
    setUsername(username: string) {
      this.username = username;
    },
    /**
     * @description 设置头像
     * @param {*} avatar
     */
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    /**
     * @description 登录拦截放行时，设置虚拟角色
     */
    setVirtualRoles() {
      const aclStore = useAclStore();
      aclStore.setFull(true);
      this.setUsername('admin(未开启登录拦截)');
      this.setAvatar('./static/svg/avatar.svg');
    },
    /**
     * @description 设置token并发送提醒
     * @param {string} token 更新令牌
     * @param {string} tokenName 令牌名称
     */
    afterLogin(token: string, tokenName: string) {
      const settingsStore = useSettingsStore();
      if (token) {
        this.setToken(token);
        const hour = new Date().getHours();
        const thisTime =
          hour < 8
            ? '早上好'
            : hour <= 11
              ? '上午好'
              : hour <= 13
                ? '中午好'
                : hour < 18
                  ? '下午好'
                  : '晚上好';
        gp.$baseNotify(`欢迎登录${settingsStore.title}`, `${thisTime}！`);
      } else {
        const err = `登录接口异常，未正确返回${tokenName}...`;
        gp.$baseMessage(err, 'error', 'hey');
        throw err;
      }
    },
    /**
     * @description 登录
     * @param {*} userInfo
     */
    async login(userInfo: any) {
      const {
        // data: { [tokenName]: token },
        data: token,
      } = await login(userInfo);
      this.afterLogin(token, tokenName);
      // 登录成功后立即获取用户信息
      await this.getUserInfo();
    },
    /**
     * @description 获取用户信息接口 这个接口非常非常重要，如果没有明确底层前逻辑禁止修改此方法，错误的修改可能造成整个框架无法正常使用
     * @returns
     */
    async getUserInfo() {
      const res = await getCurrentUserInfo();
      const { name: username, avatar, webMenus, teamList, roleList } = res?.data || {};
      const roles: string[] = [];
      const permissions = ['*'];
      /**
       * 授权的菜单
       */
      const rt = useRoutesStore();
      rt.webMenus = webMenus.sort((a, b) => a.sort - b.sort);
      /**
       * 保存分组 和 角色
       */
      this.teamList = teamList || [];
      this.roleList = roleList || [];
      /**
       * 检验返回数据是否正常，无对应参数，将使用默认用户名,头像,Roles和Permissions
       * username {String}
       * avatar {String}
       * roles {List}
       * ability {List}
       */
      if (
        (username && !isString(username)) ||
        (avatar && !isString(avatar)) ||
        (roles && !isArray(roles)) ||
        (permissions && !isArray(permissions))
      ) {
        const err = 'getUserInfo核心接口异常，请检查返回JSON格式是否正确';
        gp.$baseMessage(err, 'error', 'hey');
        throw err;
      } else {
        const aclStore = useAclStore();
        // 如不使用username用户名,可删除以下代码
        if (username) this.setUsername(username);
        // 如不使用avatar头像,可删除以下代码
        if (avatar) this.setAvatar(avatar);
        // 如不使用roles权限控制,可删除以下代码
        if (roles) aclStore.setRole(roles);
        // 如不使用permissions权限控制,可删除以下代码
        if (permissions) aclStore.setPermission(permissions);
      }
    },
    /**
     * @description 退出登录
     */
    async logout() {
      await logout();
      await this.resetAll();
    },
    /**
     * @description 重置token、roles、permission、router、tabsBar等
     */
    async resetAll() {
      const aclStore = useAclStore();
      const tabsStore = useTabsStore();

      // 清除token
      await removeToken();
      this.setToken('');

      // 清空权限和角色
      await aclStore.setPermission([]);
      await aclStore.setFull(false);
      await aclStore.setRole([]);

      // 清除tabs
      await tabsStore.delAllVisitedRoutes();

      // 清除localStorage中的相关缓存
      if (storage === 'localStorage') {
        // 只移除用户相关数据，不影响主题等设置
        localStorage.removeItem('caughtRoutes');
      }

      // 重置用户信息
      this.setUsername('游客');
      this.setAvatar('./static/svg/avatar.svg');
    },
  },
});
