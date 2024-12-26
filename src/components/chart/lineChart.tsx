import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { isNumber } from '@estjs/tools';
import Chart from '@/components/chart/index.vue';
import { useChartOption } from '@/hooks';

const Props = {
  data: {
    type: Array as PropType<any[][] | any[]>,
    default: [[]],
  },
  names: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  height: {
    type: [String, Number],
    default: 300,
  },
  legend: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
};
export default defineComponent({
  name: 'LineChart',
  props: Props,
  setup(props) {
    const { chartOption } = useChartOption(() => {
      const isMultipleLine = Array.isArray(props.data[0]);
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: 60,
          bottom: 20,
          left: 0,
          right: 0,
          containLabel: true,
        },
        yAxis: {
          type: 'value',
        },
        legend: props.legend.length
          ? {
              data: props.legend,
            }
          : {},
        xAxis: {
          type: 'category',
          data: (isMultipleLine ? props.data[0] : props.data)?.map(item => {
            return item.name;
          }),
        },
        series: isMultipleLine
          ? props.data.map((val, idx) => {
              return {
                type: 'line',
                name: props.names[idx],
                data: val.map(item => {
                  return item.value;
                }),
              };
            })
          : {
              type: 'line',
              name: '',
              data: props.data.map(item => {
                return item.value;
              }),
            },
      };
    });

    const height = computed(() => {
      if (isNumber(props.height)) {
        return props.height + 'px';
      }
      return props.height;
    });
    return () => (
      <div>
        <Chart class="w-full!" style={{ height: height.value }} options={chartOption.value} />
      </div>
    );
  },
});
