//  废弃
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import Chart from '@/components/chart/index.vue';
import useChartOption from '@/hooks/chart-option';

interface treeType {
  name: string;
  classify: string;
  children?: treeType[];
}
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

const rich = {
  first: {
    backgroundColor: '#078E34',
    color: '#fff',
    align: 'center',
    width: 135,
    height: 30,
    borderRadius: [5, 5, 0, 0],
  },
  second: {
    color: '#888',
    align: 'center',
    lineHeight: 17,
  },
};
export default defineComponent({
  name: 'TreeChart',
  props: Props,
  setup(props) {
    const translate = (tree: treeType) => {
      const item = {
        name: tree.name,
        label: {
          backgroundColor: '#F4F4F4',
          borderRadius: [0, 0, 5, 5],
          formatter: [`{first|${tree.name}}`, '{second|成立时间：2009年\n注册地：深圳}'].join('\n'),
          rich,
        },
      };
    };
    const { chartOption } = useChartOption(() => {
      return {
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            // dataView : {show: true, readOnly: false},
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        tooltip: {
          show: false,
          trigger: 'item',
          formatter: '{b}: {c}',
        },
        series: [
          {
            name: '',
            type: 'tree',
            orient: 'TB', // 竖向或水平   TB代表竖向  LR代表水平
            edgeShape: 'curve', // 控制折线的形式
            top: '10%',
            initialTreeDepth: 10, // 树图初始展开的层级（深度）
            expandAndCollapse: true, // 点击节点时不收起子节点，default: true
            itemStyle: {
              color: 'transparent',
              borderWidth: 0,
            },
            lineStyle: {
              color: '#D5D5D5',
              width: 1,
              // curveness: 0.7,
            },
            animationDuration: 0, // 防止图片第一次加载不显示
            data: [
              {
                name: 'xxxx科技有限公司',
                label: {
                  backgroundColor: '#F4F4F4',
                  borderRadius: [0, 0, 5, 5],
                  formatter: [
                    '{compts|xxxx科技有限公司}',
                    '{second|成立时间：2009年\n注册地：深圳}',
                  ].join('\n'),
                  rich: {
                    first: {
                      backgroundColor: '#078E34',
                      color: '#fff',
                      align: 'center',
                      width: 135,
                      height: 30,
                      borderRadius: [5, 5, 0, 0],
                    },
                    second: {
                      color: '#888',
                      align: 'center',
                      lineHeight: 17,
                    },
                  },
                },
                children: [
                  {
                    name: 'xxxx销售一部',
                    value: 4,
                    label: {
                      formatter: ['{compts|销售一部}'].join('\n'),
                      rich: {
                        first: {
                          backgroundColor: '#3AC082',
                          color: '#fff',
                          align: 'center',
                          width: 116,
                          height: 42,
                          borderRadius: 5,
                        },
                      },
                    },
                    children: [
                      {
                        label: {
                          backgroundColor: '#F4F4F4',
                          borderRadius: [0, 0, 5, 5],
                          formatter: ['{compts|192.168.1.13}', '{second|状态：未确认}'].join('\n'),
                          rich: {
                            first: {
                              backgroundColor: '#FF6C6A',
                              color: '#fff',
                              align: 'center',
                              width: 116,
                              height: 30,
                              borderRadius: [5, 5, 0, 0],
                            },
                            second: {
                              color: '#888',
                              align: 'center',
                              lineHeight: 17,
                            },
                          },
                        },
                      },
                      {
                        label: {
                          backgroundColor: '#F4F4F4',
                          borderRadius: [0, 0, 5, 5],
                          formatter: ['{compts|192.168.1.15}', '{second|状态：未确认}'].join('\n'),
                          rich: {
                            first: {
                              backgroundColor: '#FF6C6A',
                              color: '#fff',
                              align: 'center',
                              width: 116,
                              height: 30,
                              borderRadius: [5, 5, 0, 0],
                            },
                            second: {
                              color: '#888',
                              align: 'center',
                              lineHeight: 17,
                            },
                          },
                        },
                      },
                      {
                        label: {
                          backgroundColor: '#F4F4F4',
                          borderRadius: [0, 0, 5, 5],
                          formatter: [
                            '{compts|192.168.1.12}',
                            '{second|状态：已确认\n数据库总数：3个\n表总数：21个}',
                          ].join('\n'),
                          rich: {
                            first: {
                              backgroundColor: '#3AC082',
                              color: '#fff',
                              align: 'center',
                              width: 116,
                              height: 30,
                              borderRadius: [5, 5, 0, 0],
                            },
                            second: {
                              color: '#888',
                              align: 'center',
                              lineHeight: 17,
                            },
                          },
                        },
                      },
                      {
                        label: {
                          backgroundColor: '#F4F4F4',
                          borderRadius: [0, 0, 5, 5],
                          formatter: ['{compts|192.168.1.16}', '{second|状态：未确认}'].join('\n'),
                          rich: {
                            first: {
                              backgroundColor: '#FF6C6A',
                              color: '#fff',
                              align: 'center',
                              width: 116,
                              height: 30,
                              borderRadius: [5, 5, 0, 0],
                            },
                            second: {
                              color: '#888',
                              align: 'center',
                              lineHeight: 17,
                            },
                          },
                        },
                      },
                    ],
                  },
                  {
                    label: {
                      formatter: ['{compts|销售二部}'].join('\n'),
                      rich: {
                        first: {
                          backgroundColor: '#3AC082',
                          color: '#fff',
                          align: 'center',
                          width: 116,
                          height: 42,
                          borderRadius: 5,
                        },
                      },
                    },
                  },
                  {
                    label: {
                      formatter: ['{compts|研发部}'].join('\n'),
                      rich: {
                        first: {
                          backgroundColor: '#3AC082',
                          color: '#fff',
                          align: 'center',
                          width: 116,
                          height: 42,
                          borderRadius: 5,
                        },
                      },
                    },
                  },
                  {
                    label: {
                      formatter: ['{compts|人资部}'].join('\n'),
                      rich: {
                        first: {
                          backgroundColor: '#3AC082',
                          color: '#fff',
                          align: 'center',
                          width: 116,
                          height: 42,
                          borderRadius: 5,
                        },
                      },
                    },
                  },
                  {
                    label: {
                      formatter: ['{compts|财务部}'].join('\n'),
                      rich: {
                        first: {
                          backgroundColor: '#3AC082',
                          color: '#fff',
                          align: 'center',
                          width: 116,
                          height: 42,
                          borderRadius: 5,
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
    });
    return () => (
      <div class="relative">
        <Chart class="w-full! h-300px!" options={chartOption.value} />
      </div>
    );
  },
});
