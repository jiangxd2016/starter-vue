import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { logout, login as userLogin } from '@/service/api';
import router from '@/router';
import { setRouter } from '@/router/permission';
import { useToken } from '@/hooks';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: useLocalStorage('userInfo', {
      name: '',
      avatar: '',
      id: '',
    }),
  }),
  actions: {
    logout() {
      logout().then(() => {
        useToken.clear();
        this.userInfo = {};

        router.push({ name: 'login' });
      });
    },
    // Login
    async login(loginForm) {
      try {
        const res = await userLogin(loginForm);
        this.userInfo = res.data;
        useStorage('token', res.data?.access_token);
        useStorage('menu', res.data?.role.menus);
        const timeInfo = dayjs('2023-11-21 14:00:00').format('YYYY-MM-DD HH:mm:ss');
        localStorage.setItem('timeInfo', timeInfo);
        await setRouter(router);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
});
