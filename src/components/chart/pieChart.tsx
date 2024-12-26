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
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
};
export default defineComponent({
  name: 'PieChart',
  props: Props,
  setup(props) {
    const { chartOption } = useChartOption(() => {
      return {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          bottom: '-10%',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true,
        },
        series: [
          {
            type: 'pie',
            radius: '60%',
            label: {
              show: true,
              formatter: '{b}：{d}%', // 用来换行
            },
            data: props.data.map(item => {
              return { value: item.value, name: item.name };
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    });
    return () => (
      <div class="relative">
        <p class="w-full flex items-center my-md">
          <div class="w-6px h-20px mr-10px bg-#108EE9"></div>
          {props.title}
        </p>
        {props.total && (
          <p class="absolute top-[50px] w-full text-center text-16px font-500">
            能耗总值:{props.data.reduce((prev, current) => prev + current.value, 0)}kWh
          </p>
        )}
        <Chart class="w-full! h-300px!" options={chartOption.value} />
      </div>
    );
  },
});
