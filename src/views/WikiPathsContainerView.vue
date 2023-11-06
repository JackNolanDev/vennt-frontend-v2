<template>
  <BaseLayout
    :class="{ 'prefers-sidebar': prefersSidebar }"
    class="nav sidebar"
  >
    <template #nav><WikiNav></WikiNav></template>
    <template #sidebar>
      <WikiSidePanel></WikiSidePanel>
    </template>
    <RouterView></RouterView>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import WikiNav from "@/components/Wiki/WikiNav.vue";
import WikiSidePanel from "@/components/Wiki/WikiSidePanel.vue";
import router, { WIKI_PATHS_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { idValidator, optionalIdValidator } from "vennt-library";
import { computed, onBeforeMount } from "vue";

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

onBeforeMount(() => {
  jsonStorage.fetchAbilities();
  const id = idValidator.safeParse(router.currentRoute.value.query.entity);
  if (!id.success) {
    return;
  }
  const campaignIdCheck = optionalIdValidator.safeParse(
    router.currentRoute.value.query.campaign
  );
  const campaignId = campaignIdCheck.success ? campaignIdCheck.data : undefined;
  if (!entityStore.entity || entityStore.entity.entity.id !== id.data) {
    entityStore.clearLocalEntity();
    entityStore.fetchCollectedEntity(id.data, campaignId);
  }
});

const prefersSidebar = computed(
  () => router.currentRoute.value.name === WIKI_PATHS_ROUTE
);
</script>
