<script setup lang="ts">
import Counter from '@/components/Counter';

const name = ref('');
const IndexRef = ref<HTMLElement>();

onMounted(() => {
  console.info(IndexRef.value?.innerHTML);
});

const router = useRouter();
const go = () => {
  if (name.value) {
    router.push(`/hi/${encodeURIComponent(name.value)}`);
  }
};
</script>

<template>
  <div ref="IndexRef" class="wrapper">
    <div i-carbon-campsite inline-block text-4xl />
    <Counter />
    <p>
      <a rel="noreferrer" href="" target="_blank"> Vite Starter </a>
    </p>
    <p>
      <em text-sm op75>Opinionated Vite Starter Template</em>
    </p>

    <div py-4 />

    <input
      id="input"
      v-model="name"
      placeholder="What's your name?"
      type="text"
      autocomplete="false"
      p="x-4 y-2"
      w="250px"
      text="center"
      bg="transparent"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
      @keydown.enter="go"
    />

    <div>
      <button class="m-3 text-sm btn" :disabled="!name" @click="go">Go</button>
    </div>
  </div>
</template>
