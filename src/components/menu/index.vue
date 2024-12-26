<script lang="tsx">
import { defineComponent, ref, h, computed } from "vue";
import { useRouter, RouteRecordRaw, RouteMeta } from "vue-router";
import { listenerRouteChange } from "@/utils/routeListener";
import { constantRoutes } from "@/router";

import menuIcon from "@/assets/icon.svg"
export default defineComponent({
  emit: ["collapse"],
  name: "ApMenu",
  props:{
    pop:{
      type:Boolean,
      default:false
    }
  },
  setup(props) {
    const router = useRouter();
    const syncRouter = router.getRoutes()
    const menuCollapse = ref(false);

    const menuRouter = syncRouter.find(item => item.name === 'root')?.children || []

    const selectedKey = ref<string[]>([]);
    const goto = (item) => {
      if (selectedKey.value[0] === item.path) {
        return
      }
      const { hideInMenu, activeMenu } = item.meta as RouteMeta;
      if (!hideInMenu && !activeMenu) {
        selectedKey.value = [item.path as string];
      }
      router.push({
        name: item.name
      });
    };
    listenerRouteChange((newRoute) => {

      const key = newRoute.path as string;
      selectedKey.value = [key];
    }, true);

    const renderSubMenu = () => {
      function loopMenu(_route: any, parent = true) {
        return _route.map((element) => {
          if(element.meta.hidden){
            return
          }

          if (element.children && element.children.length) {
            return (
              <a-sub-menu
                key={element.path}
                v-slots={{
                  icon: () => (parent && !props.pop ? <img src={menuIcon} class="w-20px h-20px ml-10px" /> : ""),
                  title: () => element.meta.name || "!23",
                }}
              >
                {loopMenu(element.children ?? [], false)}
              </a-sub-menu>
            );
          }
          return (
            <a-menu-item
              key={element.path}
              onClick={() => goto(element)}
              v-slots={{
                icon: () => (parent && !props.pop ? <img src={menuIcon} class="w-20px h-20px ml-10px" /> : ""),
                title: () => element.meta.name || "",
              }}
            >
              {element.meta.name || ""}
            </a-menu-item>
          );
        });
      }

      return loopMenu(menuRouter);
    };

    return () => (
      <a-menu theme="dark" collapsed={menuCollapse.value} show-collapse-button={!props.pop} selected-keys={selectedKey.value} auto-open-selected={true} level-indent={18} class="flex-1 overflow-auto ap-menu">
        {renderSubMenu()}
      </a-menu>
    );
  },
});
</script>


<style lang="scss" scoped>
.ap-menu {
  background-color: #00262D;

  .arco-menu-inline-header {
    display: flex;
    align-items: center;
    padding: 0 !important;
  }

  :deep(.arco-menu-inner) {
    padding: 0;
  }

  .arco-icon {
    &:not(.arco-icon-down) {
      font-size: 18px;
    }
  }

  :deep(.arco-menu-item) {
    background: rgba(0, 214, 255, 0.1);
    margin: 1px;
    padding: 1px;
    height: 50px;
    color: #00B7B6 !important;

  }

  :deep(.arco-menu-inline-header) {
    background: rgba(0, 214, 255, 0.1);
    margin: 1px;
    padding: 1px;
    height: 50px;
    color: #00B7B6 !important;
  }

  :deep(.arco-menu-inline-content) {
    .arco-menu-item {
      background-color: #00262D !important;
    }
  }

  :deep(.arco-menu-selected) {
    color: #FDF900;
    background: rgba(253, 249, 0, 0.2);

  }
}
</style>
