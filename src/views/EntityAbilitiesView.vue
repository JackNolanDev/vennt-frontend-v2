<template>
  <h1>Abilities</h1>
  <div v-if="entityStore.entityAttributes.xp" class="alignRow labelText mb-16">
    Spent XP:
    <BaseFraction
      :top="bulkSum"
      :bottom="entityStore.entityAttributes.xp.val"
      class="ml-16"
    ></BaseFraction>
  </div>
  <AbilityTable :abilities="entityStore.sortedAbilities"></AbilityTable>
  <AbilitySearch></AbilitySearch>
  <div class="mb-128"></div>
</template>
<script setup lang="ts">
import AbilitySearch from "@/components/Abilities/AbilitySearch.vue";
import AbilityTable from "@/components/Abilities/AbilityTable.vue";
import BaseFraction from "@/components/Base/BaseFraction.vue";
import { useEntityStore } from "@/stores/entity";
import { actualXPCost } from "@/utils/abilityUtils";
import { computed } from "vue";

const entityStore = useEntityStore();

const bulkSum = computed(() =>
  entityStore.entity
    ? entityStore.entity.abilities.reduce(
        (sum, ability) => sum + actualXPCost(ability, entityStore.entity),
        0
      )
    : 0
);
</script>
