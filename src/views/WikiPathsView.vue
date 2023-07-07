<template>
  <BaseLayout class="nav sidebar prefers-sidebar">
    <template #nav><WikiNav></WikiNav></template>
    <template #sidebar>
      <WikiSidePanel></WikiSidePanel>
    </template>
    <PageLayout>
      <h1>Path Map</h1>
      <div class="mb-256"></div>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import WikiNav from "@/components/Wiki/WikiNav.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import WikiSidePanel from "@/components/Wiki/WikiSidePanel.vue";
import router from "@/router";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { idValidator } from "@/utils/backendTypes";
import { onBeforeMount } from "vue";

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();
jsonStorage.fetchAbilities();

onBeforeMount(() => {
  const id = idValidator.safeParse(router.currentRoute.value.query.entity);
  if (!id.success) {
    return;
  }
  if (!entityStore.entity || entityStore.entity.entity.id !== id.data) {
    entityStore.clearLocalEntity();
    entityStore.fetchCollectedEntity(id.data);
  }
});
/*
Add custom nav for wiki
  - add search box for paths / abilities.
  - left side add link for returning to entity page
*/
</script>
