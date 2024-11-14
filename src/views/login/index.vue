<template>
  <div
    class="flex-center relative h-full w-full bg-cover bg-center"
    :style="{ backgroundImage: `url(${bgImg})` }"
  >
    <div
      class="absolute top-0 z-[3] h-full w-full bg-cover bg-center"
      :style="{ backgroundImage: `url(${headerImg})` }"
    />
    <div
      class="absolute top-0 z-[2] h-full w-full bg-cover bg-center"
      :style="{ backgroundImage: `url(${bg2})` }"
    />
    <div class="login-form-wrapper absolute left-[calc(50%-210px)] z-10">
      <div
        class="login-form-title mb-lg w-full bg-cover bg-center text-center text-22px text-white font-500"
      >
        {{ $t('login.form.title') }}
      </div>
      <a-form
        :model="userInfo"
        size="large"
        class="login-form"
        layout="vertical"
        @submit="handleSubmit"
      >
        <a-form-item
          field="username"
          :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input v-model="userInfo.username" :placeholder="$t('login.form.userName.placeholder')">
            <template #prefix>
              <icon-user class="text-16px! text-white!" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input-password
            v-model="userInfo.password"
            :placeholder="$t('login.form.password.placeholder')"
            allow-clear
          >
            <template #prefix>
              <icon-lock class="text-16px! text-white!" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item field="code_value" :validate-trigger="['change', 'blur']" hide-label>
          <a-button type="primary" html-type="submit" class="submit-btn" long :loading="loading">
            {{ $t('login.form.login') }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';

// for npm
import { useUserStore } from '@/store';
import { useLoading } from '@/hooks';
import headerImg from '@/assets/image/login/header.png';
import bgImg from '@/assets/image/login/bg.jpg';
import bg2 from '@/assets/image/login/bg-21.png';
import { HMAC } from '@/utils';
import type { ValidatedError } from '@arco-design/web-vue/es/form/interface';

const router = useRouter();
const { t } = useI18n();
const errorMessage = ref('');
const { loading, setLoading } = useLoading();
const userStore = useUserStore();
const loginConfig = ref({
  rememberPassword: true,
  username: '',
  password: '',
});
const userInfo = reactive({
  username: loginConfig.value.username,
  password: loginConfig.value.password,
  code_value: '',
  code_id: '',
});

const handleSubmit = async ({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  // useToken.set('123');
  // router.push({
  //   name: 'power',
  // });
  // Message.success(t('login.form.login.success'));

  // return;
  ///
  if (loading.value) {
    return;
  }
  if (!errors) {
    setLoading(true);
    try {
      const { username, password } = values;
      const pwd = await HMAC(password);
      await userStore.login({
        username,
        // password: md5(password) as string,
        password: pwd,
      });
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      router.push({
        name: 'portal',
        query: {
          ...othersQuery,
        },
      });
      Message.success(t('login.form.login.success'));
      const { rememberPassword } = loginConfig.value;
      loginConfig.value.username = rememberPassword ? username : '';
      loginConfig.value.password = rememberPassword ? password : '';
    } catch (error) {
      console.log(error.response.data.detail);
      Message.error(error.response.data.detail);
      // errorMessage.value = err.response.data.detail;
    } finally {
      setLoading(false);
    }
  }
};

const setRememberPassword = (value: boolean) => {
  loginConfig.value.rememberPassword = value;
};
</script>

<style lang="scss" scoped>
.login-form-wrapper {
  width: 420px !important;
}
.login-form {
  width: 420px;
  left: 50%;
  :deep(.arco-input-wrapper) {
    height: 52px;
    width: 420px;
    font-size: 22px;
    color: #fff !important;
    border: 2px solid #76ffd5;
    background: linear-gradient(90deg, #26a9a2 0%, #26c9aa 54%, #26a9a2 100%);
    box-shadow: 0px 0px 70px 0px #116369;
    border-radius: 2px;

    .arco-input {
      font-size: 22px;
    }
  }

  :deep(.arco-input::placeholder) {
    color: #fff !important;
    font-size: 22px;
  }

  &-wrapper {
    width: 320px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}

.login-form-title {
  height: 40px;
  font-size: 42px;
  font-weight: 400;
  margin-bottom: 30px;
}
.submit-btn {
  width: 420px;
  height: 52px;
  margin-top: 10px;
  font-size: 24px;
  border: 2px solid #61d4cf;
  background: linear-gradient(90deg, #ffffff 0%, #47fdb3 0%, #084b55 0%, #084b55 100%);
  box-shadow: 0px 0px 70px 0px #116369;
  border-radius: 2px;
}
</style>
