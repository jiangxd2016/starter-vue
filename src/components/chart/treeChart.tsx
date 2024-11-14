import { defineComponent } from 'vue';
import G6 from '@antv/g6';
import { isEmpty } from 'lodash-es';

const Props = {
  hh: {
    type: Number,
  },
  data: {
    type: Object,
    default: () => {
      return {};
    },
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

const translate = val => {
  const item = {
    id: val.id,
    name: val.name,
    value: val.value,
    total: val.total,
    classify: val.classify,
    loadChildren: false,
    hasChildren: false,
    children: [],
  };
  if (val.children) {
    if (Array.isArray(val.children)) {
      item.children = val.children.map(t => translate(t));
      item.loadChildren = true;
      item.hasChildren = !!val.children.length;
    } else {
      item.hasChildren = !!val.children;
      item.loadChildren = !item.hasChildren;
      item.children = [];
    }
  }
  return item;
};

export default defineComponent({
  name: 'TreeChart',
  props: Props,
  setup(props) {
    const hh = props.hh;
    let init = false;
    let graph: any = null;

    const treeInit = treeData => {
      const colors = {
        B: '#5B8FF9',
        R: '#F46649',
        Y: '#EEBC20',
        G: '#5BD8A6',
        DI: '#A7A7A7',
      };

      //  组件props
      const props = {
        data: treeData,
        config: {
          padding: [50, 50],
          defaultLevel: 2,
        },
      };

      const container = document.getElementById('container')!;
      const width = container.scrollWidth;
      const height = container.scrollHeight || hh;

      // 默认配置
      const defaultConfig = {
        width,
        height,
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
        },
        linkCenter: true,
        pixelRatio: 2,
        animate: true,
        defaultNode: {
          size: [160, 80],
          type: 'flow-rect',
        },
        defaultEdge: {
          type: 'flow-line',
          style: {
            stroke: '#ccc',
          },
        },
        layout: {
          type: 'compactBox',
          direction: 'TB',
          indent: 300,
          getHeight: function getHeight() {
            return 20;
          },
          getWidth: function getWidth() {
            return 20;
          },
          getVGap: function getVGap() {
            return 70;
          },
          getHGap: function getHGap() {
            return 90;
          },
        },
      };

      // 自定义节点、边
      const registerFn = () => {
        /**
         * 自定义节点
         */
        G6.registerNode(
          'flow-rect',
          {
            shapeType: 'flow-rect',
            draw(cfg, group) {
              const { name = '', value, total, collapsed, currency } = cfg as any;

              const rectConfig = {
                height: 80,
                width: 160,
                lineWidth: 1,
                fontSize: 12,
                fill: '#fff',
                radius: 4,
                stroke: '#ccc',
                opacity: 1,
              };

              const nodeOrigin = {
                x: -rectConfig.width / 2,
                y: -rectConfig.height / 2,
              };

              const textConfig = {
                textAlign: 'left',
                textBaseline: 'bottom',
              } as const;

              const rect = group.addShape('rect', {
                attrs: {
                  x: nodeOrigin.x,
                  y: nodeOrigin.y,
                  ...rectConfig,
                },
              });

              const rectBBox = rect.getBBox();

              // label title
              group.addShape('text', {
                attrs: {
                  ...textConfig,
                  x: 12 + nodeOrigin.x,
                  y: 20 + nodeOrigin.y,
                  text: name.length > 28 ? name.substr(0, 28) + '...' : name,
                  fontSize: 14,
                  opacity: 0.85,
                  fill: '#60646f',
                  fontWeight: 600,
                  cursor: 'pointer',
                },
                // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                name: 'name-shape',
              });
              group.addShape('text', {
                attrs: {
                  ...textConfig,
                  x: 12 + nodeOrigin.x,
                  y: rectBBox.maxY - 38,
                  text: `总${value}kW.h`,
                  fontSize: 12,
                  fill: '#60646f',
                  opacity: 0.85,
                },
              });
              // group.addShape('text', {
              //   attrs: {
              //     ...textConfig,
              //     x: price.getBBox().maxX + 5,
              //     y: rectBBox.maxY - 6,
              //     text: total,
              //     fontSize: 12,
              //     fill: '#60646f',
              //     opacity: 0.75,
              //   },
              // });

              // variable name

              // collapse rect
              if (cfg.hasChildren) {
                // label currency
                group.addShape('text', {
                  attrs: {
                    ...textConfig,
                    x: 12 + nodeOrigin.x,
                    y: rectBBox.maxY - 20,
                    text: `分${total}kW.h`,
                    fontSize: 12,
                    fill: '#60646f',
                    opacity: 0.85,
                  },
                });
                const val = (value ? (((total - value) / value) * 100).toFixed(2) : '-') + '%';
                group.addShape('text', {
                  attrs: {
                    ...textConfig,
                    x: -nodeOrigin.x / 2 + 34,
                    y: rectBBox.maxY - 6,
                    text: val,
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: 'right',
                    fill: val.startsWith('-') ? 'black' : 'red',
                    opacity: 0.45,
                  },
                });
                group.addShape('rect', {
                  attrs: {
                    x: -8,
                    y: rectConfig.height / 2 - 8,
                    width: 16,
                    height: 16,
                    radius: 4,
                    stroke: 'rgb(52,145,250)',
                    cursor: 'pointer',
                    fill: 'rgb(52,145,250)',
                  },
                  // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                  name: 'collapse-back',
                  modelId: cfg.id,
                });

                // collpase text
                group.addShape('text', {
                  attrs: {
                    x: 0,
                    y: rectConfig.height / 2 - 2,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: collapsed ? '+' : '-',
                    fontSize: 16,
                    cursor: 'pointer',
                    fill: '#fff',
                  },
                  // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                  name: 'collapse-text',
                  modelId: cfg.id,
                });
              }

              this.drawLinkPoints(cfg, group);
              return rect;
            },
            update(cfg, item) {
              const { level, status, name } = cfg as any;
              const group = item.getContainer();
              let mask = group.find(ele => ele.get('name') === 'mask-shape');
              let maskLabel = group.find(ele => ele.get('name') === 'mask-label-shape');
              if (level === 0) {
                group.get('children').forEach(child => {
                  if (child.get('name')?.includes('collapse')) {
                    return;
                  }
                  child.hide();
                });
                if (!mask) {
                  mask = group.addShape('rect', {
                    attrs: {
                      x: -101,
                      y: -30,
                      width: 202,
                      height: 60,
                      opacity: 0,
                      fill: colors[status],
                    },
                    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                    name: 'mask-shape',
                  });
                  maskLabel = group.addShape('text', {
                    attrs: {
                      fill: '#fff',
                      fontSize: 20,
                      x: 0,
                      y: 10,
                      text: name.length > 28 ? name.substr(0, 16) + '...' : name,
                      textAlign: 'center',
                      opacity: 0,
                    },
                    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                    name: 'mask-label-shape',
                  });
                  const collapseRect = group.find(ele => ele.get('name') === 'collapse-back');
                  const collapseText = group.find(ele => ele.get('name') === 'collapse-text');
                  collapseRect?.toFront();
                  collapseText?.toFront();
                } else {
                  mask.show();
                  maskLabel.show();
                }
                mask.animate({ opacity: 1 }, 200);
                maskLabel.animate({ opacity: 1 }, 200);
                return mask;
              } else {
                group.get('children').forEach(child => {
                  if (child.get('name')?.includes('collapse')) {
                    return;
                  }
                  child.show();
                });
                mask?.animate(
                  { opacity: 0 },
                  {
                    duration: 200,
                    callback: () => mask.hide(),
                  },
                );
                maskLabel?.animate(
                  { opacity: 0 },
                  {
                    duration: 200,
                    callback: () => maskLabel.hide(),
                  },
                );
              }
              this.updateLinkPoints(cfg, group);
            },
            setState(name: any, value, item) {
              if (name === 'collapse') {
                const group = item!.getContainer();
                const collapseText = group.find(e => e.get('name') === 'collapse-text');
                if (collapseText) {
                  if (!value) {
                    collapseText.attr({
                      text: '-',
                    });
                  } else {
                    collapseText.attr({
                      text: '+',
                    });
                  }
                }
              }
            },
            // getAnchorPoints() {
            //   return [
            //     [0, 0.5],
            //     [1, 0.5],
            //   ];
            // },
          },
          'rect',
        );

        G6.registerEdge('flow-line', {
          draw(cfg: any, group) {
            const startPoint = cfg.startPoint;
            const endPoint = cfg.endPoint;

            const { style } = cfg;
            const shape = group.addShape('path', {
              attrs: {
                stroke: style.stroke,
                endArrow: style.endArrow,
                path: [
                  ['M', startPoint.x, startPoint.y],
                  ['L', startPoint.x, (startPoint.y + endPoint.y) / 2],
                  ['L', endPoint.x, (startPoint.y + endPoint.y) / 2],
                  ['L', endPoint.x, endPoint.y],
                ],
              },
            });

            return shape;
          },
        });
      };

      registerFn();

      const { data, config } = props;

      const initGraph = data => {
        if (!data) {
          return;
        }
        if (init && graph) {
          graph.data(data);
          graph.render();
          graph.fitCenter();
          return;
        }

        graph = new G6.TreeGraph({
          container: 'container',
          ...defaultConfig,
          ...config,
          // plugins: [tooltip],
        });

        graph.data(data);
        graph.render();
        graph.fitCenter();
        init = true;

        const handleCollapse = e => {
          const target = e.target;
          const id = target.get('modelId');
          const item = graph.findById(id);
          const nodeModel = item.getModel();
          nodeModel.collapsed = !nodeModel.collapsed;
          graph.layout();
          graph.setItemState(item, 'collapse', nodeModel.collapsed);
        };
        graph.on('collapse-text:click', e => {
          handleCollapse(e);
        });
        graph.on('collapse-back:click', e => {
          handleCollapse(e);
        });
        graph.get('canvas').set('localRefresh', false);
      };

      initGraph(data);

      if (typeof window !== 'undefined') {
        window.onresize = () => {
          nextTick(() => {
            if (!graph || graph.get('destroyed')) {
              return;
            }
            if (!container || !container.scrollWidth || !container.scrollHeight) {
              return;
            }
            graph.changeSize(container.scrollWidth, container.scrollHeight);
            graph.render();
            graph.fitView();
          });
        };
      }
    };

    onMounted(() => {
      const treeData = translate(props.data[0]);
      treeInit(treeData);
    });
    return () => <div class="w-full h-full" id="container"></div>;
  },
});
