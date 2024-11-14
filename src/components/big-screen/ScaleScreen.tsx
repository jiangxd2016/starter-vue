import type { CSSProperties, PropType } from 'vue';
import { defineComponent, h, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { fullScreenKey } from '../shared';
import { emitter } from '@/utils/constants';
import { debounce } from '@/utils';

interface IState {
  originalWidth: string | number;
  originalHeight: string | number;
  width?: string | number;
  height?: string | number;
  observer: null | MutationObserver;
}
type IAutoScale =
  | boolean
  | {
      x?: boolean;
      y?: boolean;
    };

export default defineComponent({
  name: 'VScaleScreen',
  props: {
    width: {
      type: Number,
      default: 1920,
    },
    height: {
      type: Number,
      default: 1080,
    },
    fullScreen: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    autoScale: {
      type: [Object, Boolean] as PropType<IAutoScale>,
      default: true,
    },
    delay: {
      type: Number as PropType<number>,
      default: 500,
    },
    boxStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}),
    },
    wrapperStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}),
    },
    wrapper: {
      type: String,
      default: null,
    },
    bodyOverflowHidden: {
      type: Boolean,
      default: true,
    },
    nobg: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    let bodyOverflowHidden: string;
    const state = reactive<IState>({
      width: 0,
      height: 0,
      originalWidth: 0,
      originalHeight: 0,
      observer: null,
    });

    const styles: Record<string, CSSProperties> = {
      box: {
        overflow: 'hidden',
        backgroundSize: `100% 100%`,
        backgroundColor: `#000`,
        width: `100vw`,
        height: `100vh`,
      },
      wrapper: {
        transitionProperty: `all`,
        transitionTimingFunction: `cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDuration: `500ms`,
        overflow: `hidden`,
        zIndex: 100,
        transformOrigin: `left bottom`,
      },
    };

    const el = ref<HTMLElement>();
    const transformValue = ref('');
    /**
     * 初始化大屏容器宽高
     */
    const initSize = () => {
      return new Promise<void>(resolve => {
        nextTick(() => {
          // region 获取大屏真实尺寸
          if (props.width && props.height) {
            state.width = props.width;
            state.height = props.height + 80;
          } else {
            state.width = el.value?.clientWidth;
            state.height = el.value?.clientHeight || 0 + 80;
          }
          // endregion

          // region 获取画布尺寸
          if (!state.originalHeight || !state.originalWidth) {
            state.originalWidth = props.wrapper
              ? document.querySelector('.' + props.wrapper)?.clientWidth || 0
              : window.screen.width;
            state.originalHeight = props.wrapper
              ? document.querySelector('.' + props.wrapper)?.clientHeight || 0
              : window.screen.height;
          }
          // endregion
          resolve();
        });
      });
    };

    function initBodyStyle() {
      if (props.bodyOverflowHidden) {
        bodyOverflowHidden = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
    }
    const autoScale = (scale: number) => {
      if (!props.autoScale) {
        return;
      }

      transformValue.value = `scale(${scale},${scale})`;
    };
    const updateScale = () => {
      // 获取真实视口尺寸
      const currentWidth = props.wrapper
        ? document.querySelector('.' + props.wrapper)?.clientWidth || 0
        : document.body.clientWidth;
      const currentHeight = props.wrapper
        ? document.querySelector('.' + props.wrapper)?.clientHeight || 0
        : document.body.clientHeight;
      // 获取大屏最终的宽高
      const realWidth = state.width || state.originalWidth;
      const realHeight = state.height || state.originalHeight;
      // 计算缩放比例
      const widthScale = currentWidth / +realWidth;
      const heightScale = currentHeight / +realHeight;
      // 若要铺满全屏，则按照各自比例缩放
      if (props.fullScreen) {
        transformValue.value = `scale(${widthScale},${heightScale})`;
        return false;
      }
      // 按照宽高最小比例进行缩放
      const scale = Math.min(widthScale, heightScale);
      autoScale(scale);
    };

    const onResize = debounce(async () => {
      await initSize();
      updateScale();
    }, props.delay);
    const initMutationObserver = () => {
      useResizeObserver(el, entries => {
        onResize();
      });
    };
    onMounted(() => {
      initBodyStyle();

      nextTick(async () => {
        await initSize();
        updateScale();
        window.addEventListener('resize', onResize);
        initMutationObserver();
        emitter.on('hiddenLeftRight', () => {
          nextTick(() => {
            if (el.value?.style.display === 'none') {
              el.value.style.display = 'block';
            } else {
              el.value!.style.display = 'none';
            }
          });
        });
      });
      emitter.on(fullScreenKey, () => {
        onResize();
      });
    });
    onUnmounted(() => {
      window.removeEventListener('resize', onResize);
      state.observer?.disconnect();
      if (props.bodyOverflowHidden) {
        document.body.style.overflow = bodyOverflowHidden;
      }
    });

    return () => {
      return (
        <div ref={el} class=" w-full h-full of-hidden">
          <div
            class={
              'absolute bottom-0 left-0 flex items-end pb-2% pl-40px' +
              (props.nobg ? 'bg-transparent' : 'bgi-[mask-L.png] ')
            }
            style={{
              transform: transformValue.value,
              height: state.height + 'px',
              ...styles.wrapper,
            }}
          >
            {slots.left && slots.left()}
          </div>
          <div
            class="bgi-[mask-R.png] absolute right-0 bottom-0 flex items-end pr-40px pb-2%"
            style={{
              transform: transformValue.value,
              height: state.height + 'px',
              ...styles.wrapper,
              transformOrigin: `right bottom`,
            }}
          >
            {slots.right && slots.right()}
          </div>

          <div
            class="absolute bottom-0 left-0 w-full h-full pb-2%"
            style={{
              transform: transformValue.value,
              width: '100%',
              height: '200px',
              ...styles.wrapper,
              transformOrigin: `center bottom`,
            }}
          >
            {slots.center && slots.center()}
          </div>
        </div>
      );
    };
  },
});
