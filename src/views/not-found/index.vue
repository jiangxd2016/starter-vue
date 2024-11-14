<template>
  <a-result
    status="404"
    subtitle="对不起，您正在寻找的页面不存在!"
    class="h-full flex flex-col justify-center"
  >
    <template #extra>
      <a-space>
        <a-button type="primary" @click="$router.push({ name: 'dashboard' })">返回</a-button>
      </a-space>
    </template>
  </a-result>
</template>
