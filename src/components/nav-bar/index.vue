<template>
  <div
    class="navbar py-base h-70px bg-cover bg-no-repeat"
    :style="{ backgroundImage: `url(${barBg})` }"
  >
    <div class="left-side">
      <template v-if="slots.left">
        <slot name="left" />
      </template>
      <Breadcrumb v-else />
    </div>
    <div class="mid-side">
      <slot />
    </div>
    <ul class="right-side pr-10px">
      <li>
        <a-dropdown trigger="click">
          <a-avatar :size="32" :style="{ marginRight: '8px', cursor: 'pointer' }">
            <img alt="avatar" :src="avatar" />
          </a-avatar>
          <span class="userName text-#d5f5f0!">{{ userInfo.name }}</span>
          <template #content>
            <a-doption>
              <a-space @click="handleLogout">
                <!-- <icon-export /> -->
                <span>
                  {{ '登出登录' }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleExport">
                <!-- <icon-export /> -->
                <span>
                  {{ '数据导出' }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handlePortal">
                <!-- <icon-export /> -->
                <span>
                  {{ '返回门户' }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useDark } from '@vueuse/core';
import { cloneDeep } from 'lodash-es';
import { useRouter } from 'vue-router';
import { isDark, toggleDark } from '@/hooks';
import { useUserStore } from '@/store';
import avatar from '@/assets/image/login/avatar.png';
import barBg from '@/assets/bar-bg.png';

const router = useRouter();
const slots = useSlots();
const message = useMessage();

const isDarkRef = ref(isDark);
const messageCount = ref(0);
const visible = ref(false);
const formRef = ref();

const changePassword = reactive({
  password: '',
  old_password: '',
  confirm_password: '',
});

const resetPassword = cloneDeep(changePassword);

useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
});

const { userInfo } = useUserStore();
const handleCancel = () => {
  visible.value = false;
  Object.assign(changePassword, resetPassword);
};

const changeDark = () => {
  const mode = toggleDark();
  isDarkRef.value = mode;
  document.body.setAttribute('arco-theme', mode ? 'dark' : 'light');
};

const handleLogout = () => {
  useUserStore().logout();
};
const handleExport = () => {
  router.push({
    name: 'dataExport',
  });
};
const handlePortal = () => {
  router.push({
    name: 'portal',
  });
};
const getMessageApi = () => {};

onMounted(() => {
  const mode = toggleDark();
  isDarkRef.value = !mode;
  document.body.setAttribute('arco-theme', mode ? 'light' : 'dark');

  getMessageApi();
});

const switchRoles = async () => {};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  background-color: var(--color-bg-2);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.mid-side {
  flex: 1;
  width: 0;
}

.right-side {
  display: flex;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 10px;

    .userName {
      color: var(--color-text-1);
    }
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }
}

.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
