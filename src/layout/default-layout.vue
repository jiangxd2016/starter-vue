<template>
  <a-layout class="h-full w-full overflow-hidden">
    <div v-if="!isFullScreen" class="m-0 h-70px w-full flex-shrink-0 of-hidden p-0">
      <NavBar>
        <template #left>
          <div
            class="flex-s-0 z-1 w-full flex flex-nowrap cursor-pointer items-center py-6px color-#ccc shadow-sm"
            :class="collapsed ? 'px-6px' : 'pl-18px'"
            @click="$router.push({ name: 'dashboard' })"
          >
            <img alt="logo" class="h-54px w-54px" :src="logo" />
            <span v-if="!collapsed" class="bar-title ml-2 truncate text-16px color-#FFf"
              >default title</span
            >
          </div>
        </template>
      </NavBar>
    </div>
    <a-layout class="h-[calc(100%-70px)] w-full flex-shrink-0">
      <!-- <a-layout-sider
          v-if="!isFullScreen"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :hide-trigger="true"
          :width="menuWidth"
          @collapse="setCollapsed"
        >
          <div class="h-full flex flex-col overflow-auto">
            <Menu :collapsed="collapsed" class="flex-1" @collapse="setCollapsed" />
          </div>
        </a-layout-sider> -->
      <div class="column ma-0 h-full w-full flex-1 overflow-hidden pa-0">
        <div class="column relative flex-1 of-hidden">
          <a-layout-content class="flex of-hidden">
            <PageLayout />
          </a-layout-content>
        </div>
      </div>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import NavBar from '@/components/nav-bar/index.vue';

import logo from '@/assets/logo.png';
import { emitter } from '@/utils/constants';
import PageLayout from './page-layout.vue';

const collapsed = ref(false);
const isFullScreen = ref(false);
const loading = ref(false);

const setCollapsed = (val: boolean) => {
  collapsed.value = val;
};
const menuWidth = computed(() => {
  return collapsed.value ? 48 : 220;
});

emitter.on('loading', (val: boolean) => {
  loading.value = val;
});
</script>

<style>
.bar-title {
  font-size: 24px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0.1em;

  background: linear-gradient(0deg, #bdf1ff 50%, #ffffff 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  /* text-shadow: 0px 0px 10px #092124; */
}
</style>
