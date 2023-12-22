<template>
  <PageLayout>
    <CombatStats
      v-if="entityStore.entity"
      :entity="entityStore.entity"
      :use-copyable-dice="true"
    ></CombatStats>
  </PageLayout>
</template>

<script setup lang="ts">
import CombatStats from "@/components/CombatStats/CombatStats.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import { useEntityStore } from "@/stores/entity";
const entityStore = useEntityStore();
</script>
