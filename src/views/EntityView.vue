<template>
  <BaseLayout>
    <template #nav>
      <EntityNav
        v-if="entityStore.entity"
        :entity="entityStore.entity.entity"
      ></EntityNav>
      <BaseNav v-else></BaseNav>
    </template>
    <template #sidebar>
      <CombatStats
        v-if="entityStore.entity"
        :entity="entityStore.entity"
        :use-copyable-dice="true"
      ></CombatStats>
    </template>
    <template #sidebar-right>
      <RouteBasedRightSideBar :query-params="['new']">
        <EntityRightSidebar></EntityRightSidebar>
      </RouteBasedRightSideBar>
    </template>
    <PageLayout>
      <RouterView></RouterView>
    </PageLayout>
  </BaseLayout>
  <EntityModals></EntityModals>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import CombatStats from "@/components/CombatStats/CombatStats.vue";
import { useEntityStore } from "@/stores/entity";
import { onBeforeMount, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { idValidator } from "@/utils/backendTypes";
import router, {
  ENTITY_ABILITIES_ROUTE,
  ENTITY_COMBAT_ROUTE,
  ENTITY_ITEMS_ROUTE,
  ENTITY_ITEM_SHOP_ROUTE,
  ENTITY_SETTINGS_ROUTE,
  HOME_ROUTE,
} from "@/router";
import EntityNav from "@/components/Nav/EntityNav.vue";
import BaseNav from "@/components/Nav/BaseNav.vue";
import EntityModals from "@/components/Entities/EntityModals.vue";
import RouteBasedRightSideBar from "@/components/Base/RouteBasedRightSideBar.vue";
import EntityRightSidebar from "@/components/Entities/EntityRightSidebar.vue";

const entityStore = useEntityStore();
const route = useRoute();

onBeforeMount(() => {
  const id = idValidator.safeParse(route.params.id);
  if (!id.success) {
    router.push({ name: HOME_ROUTE });
    return;
  }
  if (!entityStore.entity || entityStore.entity.entity.id !== id.data) {
    entityStore.fetchCollectedEntity(id.data);
  }

  window.addEventListener("keydown", keyMapper);
});

onUnmounted(() => {
  window.removeEventListener("keydown", keyMapper);
});

const keyMapper = (e: KeyboardEvent) => {
  if (!e.target || e.metaKey || e.ctrlKey) {
    return;
  }
  // @ts-ignore
  const src = e.target.localName;
  // @ts-ignore
  const editable = e.target.contentEditable === "true";
  if (["a", "button", "input", "textarea"].includes(src) || editable) {
    // do not override key inputs from regular text inputs
    return;
  }
  switch (e.key) {
    case "a":
      jumpToPage(ENTITY_ABILITIES_ROUTE);
      break;
    case "i":
      jumpToPage(ENTITY_ITEMS_ROUTE);
      break;
    case "c":
      jumpToPage(ENTITY_COMBAT_ROUTE);
      break;
    case "h":
      jumpToPage(ENTITY_SETTINGS_ROUTE);
      break;
    case "s":
      jumpToPage(ENTITY_ITEM_SHOP_ROUTE);
      break;
    default:
      // unassigned
      console.log(src, e);
  }
};

const jumpToPage = (name: string) => {
  if (router.currentRoute.value.name !== name && entityStore.entity) {
    router.push({
      name,
      params: { id: entityStore.entity.entity.id },
      query: router.currentRoute.value.query,
    });
  }
};
</script>
