<template>
  <BaseLayout
    :class="{ 'sidebar-right': showRightSidebar }"
    class="nav sidebar"
  >
    <template #nav>
      <EntityNav v-if="entityStore.entity"></EntityNav>
      <BaseNav v-else></BaseNav>
    </template>
    <template #sidebar>
      <EntityLeftSidebar></EntityLeftSidebar>
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
import { useEntityStore } from "@/stores/entity";
import { computed, onBeforeMount, onUnmounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import { idValidator, optionalIdValidator } from "vennt-library";
import router, {
  ENTITY_ABILITIES_ROUTE,
  ENTITY_COMBAT_ROUTE,
  ENTITY_DESCRIPTION_ROUTE,
  ENTITY_ITEMS_ROUTE,
  ENTITY_ITEM_SHOP_ROUTE,
  ENTITY_SETTINGS_ROUTE,
  HOME_ROUTE,
} from "@/router";
import EntityNav from "@/components/Entities/EntityNav.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import EntityModals from "@/components/Entities/EntityModals.vue";
import RouteBasedRightSideBar from "@/components/Base/RouteBasedRightSideBar.vue";
import EntityRightSidebar from "@/components/Entities/EntityRightSidebar.vue";
import EntityLeftSidebar from "@/components/Entities/EntityLeftSidebar.vue";
import { useEntityNotesStore } from "@/stores/entityNotes";
import { useCampaignStore } from "@/stores/campaign";
import { ENTITY_ABILITIES_SEARCH_OVERRIDE } from "@/utils/constants";

const entityStore = useEntityStore();
const entityNotesStore = useEntityNotesStore();
const campaignStore = useCampaignStore();
const route = useRoute();

let overrideCmdF = true;

onBeforeMount(() => {
  const id = idValidator.safeParse(route.params.id);
  if (!id.success) {
    router.push({ name: HOME_ROUTE });
    return;
  }
  const campaignIdCheck = optionalIdValidator.safeParse(route.query.campaign);
  const campaignId = campaignIdCheck.success ? campaignIdCheck.data : undefined;
  if (!entityStore.entity || entityStore.entity.entity.id !== id.data) {
    entityStore.clearLocalEntity();
    entityStore.fetchCollectedEntity(id.data, campaignId);
  }
  if (!campaignId) {
    campaignStore.reset();
  }

  window.addEventListener("keydown", keyMapper);
});

onUnmounted(() => {
  window.removeEventListener("keydown", keyMapper);
});

const keyMapper = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "f" && overrideCmdF) {
    switch (router.currentRoute.value.name) {
      case ENTITY_ABILITIES_ROUTE: {
        overrideCmdF = false;
        e.preventDefault();
        document.getElementById(ENTITY_ABILITIES_SEARCH_OVERRIDE)?.focus();
        return;
      }
    }
    console.log("should override search");
  }
  overrideCmdF = true;
  if (!e.target || e.metaKey || e.ctrlKey) {
    return;
  }
  const target = e.target;
  // @ts-ignore
  const src = target.localName;
  // @ts-ignore
  const editable = e.target.contentEditable === "true";
  // @ts-ignore
  const tabIndexIs0 = e.target.tabIndex === 0;
  if (
    ["a", "button", "input", "textarea"].includes(src) ||
    editable ||
    tabIndexIs0
  ) {
    // do not override key inputs from regular text inputs
    return;
  }
  switch (e.key) {
    case "f":
      jumpToPage(ENTITY_DESCRIPTION_ROUTE);
      break;
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
    case "n":
      entityNotesStore.toggleNotes();
      break;
    default:
      // unassigned
      console.log(src, e);
  }
};

const showRightSidebar = computed(() => {
  const params = router.currentRoute.value.params.detail;
  if (params) {
    return true;
  }
  const queryParams = ["new"];
  return queryParams.some((key) => router.currentRoute.value.query[key]);
});

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
