import type { PropType } from 'vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useCounter } from '@vueuse/core';

export default defineComponent({
  props: {
    initial: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  setup(props) {
    const { count, inc, dec } = useCounter(props.initial);
    const countRef = ref<HTMLDivElement>();

    return () => (
      <div ref={countRef}>
        <button class="inc btn" onClick={() => inc()}>
          +
        </button>
        <input type="text" class="text-center" v-model={count.value} />
        <button class="dec btn" onClick={() => dec()}>
          -
        </button>
      </div>
    );
  },
});
