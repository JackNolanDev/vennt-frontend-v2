<template>
  <BaseLayout>
    <template #nav><BaseNav></BaseNav></template>
    <template #sidebar>
      <CombatStats
        v-if="entityStore.entity"
        :entity="entityStore.entity"
        :use-copyable-dice="false"
      ></CombatStats>
    </template>
    <PageLayout>
      <RouterView></RouterView>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import BaseNav from "@/components/Nav/BaseNav.vue";
import CombatStats from "@/components/CombatStats/CombatStats.vue";
import { useEntityStore } from "@/stores/entity";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { idValidator } from "@/utils/backendTypes";
import router, { HOME_ROUTE } from "@/router";

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
});
</script>
