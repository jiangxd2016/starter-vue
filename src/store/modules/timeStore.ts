import { defineStore } from 'pinia';
import dayjs from 'dayjs';

export const useTimeStore = defineStore('dataTime', {
  state: () => ({
    dataTime: dayjs('2023-11-21 12:00:00').format('YYYY-MM-DD HH:mm:ss'),
  }),
  getters: {
    getDataTime() {
      return this.dataTime;
    },
  },
  actions: {
    // getDataTime() {
    //   return this.dataTime;
    // },
    setIsShow() {
      this.dataTime = dayjs('2024-11-21 24:00:00').format('YYYY-MM-DD HH:mm:ss');
      return this.dataTime;
    },
  },
});
// export default useTimeStore;
