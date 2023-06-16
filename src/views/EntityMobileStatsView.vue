<template>
  <CombatStats
    v-if="entityStore.entity"
    :entity="entityStore.entity"
    :use-copyable-dice="true"
  ></CombatStats>
</template>

<script setup lang="ts">
import CombatStats from "@/components/CombatStats/CombatStats.vue";
import { useEntityStore } from "@/stores/entity";
const entityStore = useEntityStore();
</script>
