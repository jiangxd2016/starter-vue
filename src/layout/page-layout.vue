<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in" appear>
      <div class="layer-page pa-md relative flex-1 of-hidden bg-#002B32 dark:bg-[rgb(23,23,26)]">
        <div
          v-if="isFullScreen"
          class="absolute left-60px top-30px z-199 cursor-pointer"
          @click="openMenuFn"
        >
          <i class="i-carbon-list-dropdown block text-20px text-#00a3e9" />
        </div>
        <div v-if="isFullScreen && openMenu" class="absolute left-50px top-60px z-199 w-160px">
          <Menu pop />
        </div>
        <component :is="Component" :key="route.fullPath" class="h-full of-hidden" />
      </div>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import Menu from '@/components/menu/index.vue';

import { emitter } from '@/utils/constants';
import { fullScreenKey } from '@/components/shared';

const collapsed = ref(false);
const isFullScreen = ref(false);
const openMenu = ref(false);

const openMenuFn = () => {
  openMenu.value = !openMenu.value;
};
onMounted(() => {
  const el = document.querySelector('.layer-page')! as HTMLElement;
  const { toggle } = useFullscreen(el);
  emitter.on(fullScreenKey, () => {
    isFullScreen.value = !isFullScreen.value;
    toggle();
  });
});
</script>
