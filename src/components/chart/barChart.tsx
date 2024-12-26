import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import Chart from '@/components/chart/index.vue';
import useChartOption from '@/hooks/chart-option';

const Props = {
  data: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  total: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  direction: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'horizontal',
  },
};
export default defineComponent({
  name: 'BarChart',
  props: Props,
  setup(props) {
    // 是否是多个柱
    const isMultiple = computed(() => props.data.some(item => Array.isArray(item)));

    const { chartOption } = useChartOption(() => {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: 30,
          bottom: 30,
          containLabel: true,
        },
        [props.direction === 'horizontal' ? 'xAxis' : 'yAxis']: [
          {
            type: 'value',
            position: 'top',
          },
        ],
        [props.direction === 'horizontal' ? 'yAxis' : 'xAxis']: [
          {
            type: 'category',
            data: (isMultiple.value ? props.data[0] : props.data).map(item => {
              return item.name;
            }),
          },
        ],
        series: (isMultiple.value ? props.data : [props.data]).map(item => {
          return {
            type: 'bar',
            name: item[0]?.barName,
            stack: props.direction === 'horizontal' ? 'Total' : undefined,
            data: item.map(item => {
              return item.value;
            }),
          };
        }),
      };
    });
    return () => (
      <div class="relative">
        {props.title && (
          <p class="w-full flex items-center my-md">
            <div class="w-6px h-20px mr-10px bg-#108EE9"></div>
            {props.title}
          </p>
        )}
        {props.total && (
          <p class="absolute top-[50px] w-full text-center text-16px font-500">
            能耗总值:{props.data.reduce((prev, current) => prev + current.value, 0)}kWh
          </p>
        )}
        <Chart class="w-full!" options={chartOption.value} />
      </div>
    );
  },
});
