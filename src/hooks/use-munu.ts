import type Pinyin from 'pinyin-match';
import { pullAll, xor } from 'lodash-es';
import { AuthenticationDepartmentGet, getMenuByTopMenu, getRoutesInfo } from '@/service/api';
import { list2treeNotClone } from '@/utils';
import { BTN_CLASSIFY } from '@/utils/constants';

let pinyinMatch: typeof Pinyin;
import('pinyin-match').then(r => {
  pinyinMatch = r.default;
});

interface UseMenuParams {
  onFetched?: Function; // 获取数据成功后回调
  filterBtns?: boolean; // 去除按钮
  defaultLoad?: boolean;
  system?: string;
  tranformKey?: string[]; // 将字段转化为带 `_`前缀的字段 防止与 tree 组件 字段冲突
  defaultCheckedKeys?: string[]; // 已经配置的权限菜单id数组
}

export default function useMenu({
  tranformKey = [],
  onFetched,
  filterBtns = false,
  defaultLoad = true,
  system,
  defaultCheckedKeys = [],
}: UseMenuParams = {}) {
  const treeList = ref<SystemMenuResponse>([]);
  const treeFlat = ref<SystemMenuResponse>([]);
  const loading = ref(false);

  const expandedKeys = ref<any[]>([]);
  const checkedKeys = ref<any[]>([...defaultCheckedKeys]);

  const fieldNames = ref({ key: 'id', title: 'name' });

  const searchKey = ref('');
  const dopinyinMatch = (i, keyword) => {
    if (pinyinMatch && keyword) {
      const xy = pinyinMatch.match(i.name, keyword);
      return !!xy;
    }
    return true;
  };

  const filteredTreeData = computed(() => {
    if (!searchKey.value) {
      return treeList.value;
    }
    return searchData(searchKey.value);
  });

  const allKeys = computed(() => {
    return treeFlat.value.map(i => i.id).filter(Boolean);
  });

  function searchData(keyword) {
    const loop = data => {
      const result: any[] = [];
      data.forEach(item => {
        if (dopinyinMatch(item, keyword)) {
          result.push({ ...item });
        } else if (item.children) {
          const filterData = loop(item.children);
          if (filterData.length) {
            result.push({
              ...item,
              children: filterData,
            });
          }
        }
      });
      return result;
    };

    return loop(treeList.value);
  }
  const getMenus = (system?) => {
    let resolver: any = getRoutesInfo;
    if (system) {
      resolver = getMenuByTopMenu;
    }
    if (loading.value) {
      return;
    }
    loading.value = true;
    return resolver(system)
      .then(res => {
        const list = (res?.data || [])
          .filter(i => {
            return !BTN_CLASSIFY.includes(i.classify);
          })
          .map(i => {
            const newI = Object.keys(i).reduce((ret, ky) => {
              if (Array.isArray(tranformKey) && tranformKey.includes(ky)) {
                ret[`_${ky}`] = i[ky];
              } else {
                ret[ky] = i[ky];
              }
              return ret;
            }, {});
            return {
              ...newI,
              key: i.id,
              _changed: false,
              _match: true,
              _originSort: i.sort,
              _originName: i.name,
            };
          })
          .sort((b, a) => {
            return b.sort - a.sort;
          });
        treeFlat.value = list;
        const tree = list2treeNotClone<any>(list, 'id', 'parent_menu');
        treeList.value = tree;

        const otherSysMenu = pullAll([...defaultCheckedKeys], [...allKeys.value]);
        const realPicked = xor([...defaultCheckedKeys], [...otherSysMenu]);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  onBeforeMount(() => {
    if (defaultLoad) {
      getMenus(system);
    }
  });

  const expandAll = () => {
    expandedKeys.value = allKeys.value;
  };

  const unExpandAll = () => {
    expandedKeys.value = [];
  };

  const toggleExpand = () => {
    if (expandedKeys.value?.length) {
      unExpandAll();
    } else {
      expandAll();
    }
  };
  const checkAll = () => {
    checkedKeys.value = allKeys.value;
  };

  const unCheckAll = () => {
    checkedKeys.value = [];
  };

  const toggleCheck = () => {
    if (checkedKeys.value?.length) {
      unCheckAll();
    } else {
      checkAll();
    }
  };
  const someChecked = computed(() => {
    return checkedKeys.value?.length > 0;
  });

  const someExpanded = computed(() => {
    return expandedKeys.value?.length > 0;
  });

  return {
    treeList,
    loading,
    fieldNames,
    searchKey,
    filteredTreeData,
    allKeys,
    expandedKeys,
    expandAll,
    unExpandAll,
    toggleCheck,
    toggleExpand,
    checkedKeys,
    someExpanded,
    someChecked,
    refresh: () => {
      getMenus(system);
    },
  };
}
