import NProgress from 'nprogress';
import { setRouteEmitter } from '@/utils/routeListener';
import { useToken } from '@/hooks';
import { DEFAULT_LAYOUT, WHITE_LIST } from './constants';
import type { Router } from 'vue-router';

let isInitRouter = false;
export async function setRouter(router: Router, reload = false) {
  const menuList = JSON.parse(localStorage.getItem('menu') || '[]');

  const menuArr = <any>[];
  menuList.forEach(item => {
    menuArr.push(item.name);
  });
  const developRouter = import.meta.env.NODE_ENV ? [] : [];
  const syncRouter: any[] = [];

  router.addRoute({
    name: 'root',
    path: '/',
    component: DEFAULT_LAYOUT,
    children: [...syncRouter, ...developRouter],
  });

  isInitRouter = true;
}
const createRouteGuard = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    if (to.path === from.path) {
      return;
    }

    NProgress.start();
    setRouteEmitter(to);

    const token = useToken.get();

    // already logged router to index page
    if (token && to.path === '/login') {
      next({ path: '/' });
      return;
    }
    if (!token) {
      if (WHITE_LIST.includes(to.path)) {
        next();
      } else {
        // 无法确认重定向的地址属于哪个子系统
        // next(`/login?redirect=${to.path}`);
        next('/login');
      }
      return;
    }
    if (isInitRouter) {
      next();
      return;
    }
    console.info('加载菜单');
    // 初始化菜单
    await setRouter(router);

    // TODO 跨系统跳转页面 加载系统菜单的方式有待优化
    const resolved = router.resolve({
      path: to.path,
      query: to.query,
    });

    next(resolved);
  });

  router.afterEach(() => {
    NProgress.done();
  });
};

export default createRouteGuard;
