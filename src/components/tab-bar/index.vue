<template>
  <div class="tab-bar-container">
    <a-tabs
      type="text"
      :editable="true"
      auto-switch
      :active-key="activedTab"
      @tab-click="goto as any"
      @delete="tagClose"
    >
      <a-tab-pane
        v-for="(item, index) of tagList"
        :key="item.fullPath"
        :title="item.title || item.name"
        :closable="index !== 0"
      />
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { RouteLocationNormalized } from 'vue-router';
import { listenerRouteChange } from '@/utils/routeListener';
import { useTabBarStore } from '@/store/modules/tab-bar';

const tabBarStore = useTabBarStore();
const activedTab = ref();

const router = useRouter();

const tagList = computed(() => {
  return tabBarStore.getTabList;
});

listenerRouteChange((route: RouteLocationNormalized) => {
  activedTab.value = route.fullPath as string;
  if (!route.meta.noAffix && !tagList.value.some(tag => tag.fullPath === route.fullPath)) {
    tabBarStore.updateTabList(route);
  }
}, true);
const tagClose = (fullPath: string) => {
  const { name } = tagList.value.find(item => item.fullPath === fullPath);

  tabBarStore.deleteTag(name);
  const latest = tagList.value[tagList.value.length - 1];
  router.push({ name: latest.name });
};
const goto = (tag: string) => {
  const { name, query, params } = tagList.value.find(item => item.fullPath === tag);

  router.push({ name, query, params });
};
</script>

<style scoped lang="scss">
.tab-bar-container {
  display: flex;
  align-items: flex-end;
}

:deep(.arco-tabs-tab) {
  padding: 2px !important;
  position: relative;
}

:deep(.arco-tabs-tab-active) {
  font-weight: normal;
  border-bottom: 2px solid rgb(var(--arcoblue-6));
}

:deep(.arco-tabs-tab-title:hover) {
  font-weight: normal;
}

:deep(.arco-tabs-tab-active:hover) {
  font-weight: normal;
}

:deep(.arco-tabs-content) {
  padding-top: 0;
}
</style>
