<template>
  name: <input v-model="student.name" type="text" />
  age: <input v-model="student.age" type="number" />

  <h2>{{ student.name }}</h2>
</template>

<script lang="ts" setup>
import { reactive, watchEffect } from 'vue';

const student = reactive({
  name: '',
  age: ''
});
watchEffect((oninvalidate) => {
  oninvalidate(() => {
    student.name = '张三';
  });
  console.log('name:', student.name);
}, {
  // pre 组件更新前； sync：强制效果始终同步； post：组件更新后执行
  flush: 'post' // dom加载完毕后执行
});
</script>
