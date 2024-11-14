import { defineComponent } from 'vue';

const Props = {
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
};

export default defineComponent({
  name: 'FDialog',
  props: Props,
  setup(props, { slots }) {
    return () => (
      <div class="absolute z-12000" style={{ top: `${props.y + 30}px`, left: `${props.x - 50}px` }}>
        {slots.default && slots.default()}
      </div>
    );
  },
});
