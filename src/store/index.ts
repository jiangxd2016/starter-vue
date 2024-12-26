import { createPinia } from 'pinia';
import { useUserStore } from './modules/user';
import { useTabBarStore } from './modules/tab-bar';
import { useTimeStore } from './modules/timeStore';

const pinia = createPinia();

export { useUserStore, useTabBarStore, useTimeStore };
export default pinia;
