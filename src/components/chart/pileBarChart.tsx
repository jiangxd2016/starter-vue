// 堆叠柱状图
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
  multiple: {
    type: Boolean,
    default: false,
  },

  title: {
    type: String,
    default: '',
  },
};
export default defineComponent({
  name: 'PileBarChart',
  props: Props,
  setup(props) {
    const { chartOption } = useChartOption(() => {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          show: true,
          bottom: props.multiple ? '-1.6%' : '14%',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true,
        },
        xAxis: props.multiple
          ? {
              type: 'value',
              offset: -5,
            }
          : [
              {
                splitLine: {
                  show: false,
                },
                axisLine: {
                  show: false,
                },
                axisLabel: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
              },
            ],
        yAxis: {
          inverse: true,
          type: 'category',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: props.data.map(item => item.name),
        },
        series: props.data[0]?.items.map(item => {
          return {
            name: item.name,
            type: 'bar',
            stack: 'machine',
            barWidth: 20,
            legendHoverLink: false,
            silent: true,
            label: {
              show: true,
            },
            data: item.value,
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

        <Chart
          class={[' w-full!', props.multiple ? ' h-340px!  top-[-10px]' : ' h-140px! pb-40px ']}
          options={chartOption.value}
        />
      </div>
    );
  },
});
