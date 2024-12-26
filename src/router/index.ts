import { createRouter, createWebHistory } from 'vue-router';
import createRouteGuard from './permission';

export const DefaultLayout = () => import('@/layout/default-layout.vue');
export const constantRoutes = [
  {
    name: 'root',
    path: '/',
    redirect: '/portal',
    component: DefaultLayout,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/not-found/index.vue'),
  },
  {
    path: '/',
    redirect: 'login',
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/portal',
    name: 'portal',
    component: () => import('@/views/portal/portal.vue'),
    meta: {
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior() {
    return { top: 0 };
  },
});
createRouteGuard(router);
export default router;
