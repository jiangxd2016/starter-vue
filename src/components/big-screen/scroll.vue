<template>
  <div class="es-seamless-scroll">
    <div ref="listRef" class="es-seamless-scroll-list relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';
import type { OptionsType } from '@/hooks/scroll';

const props = defineProps({
  width: {
    type: [String, Number],
  },
  height: {
    type: [String, Number],
  },
  option: {
    type: Object as PropType<OptionsType>,
    default: () => ({}),
  },
});
const listRef = ref();
const { init, pause, play } = useInfiniteScroll(listRef, props.option);

defineExpose({
  init,
  pause,
  play,
});
</script>

<style lang="scss" scoped>
.es-seamless-scroll {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
