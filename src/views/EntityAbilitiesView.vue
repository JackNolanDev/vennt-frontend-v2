<template>
  <h1>Abilities</h1>
  <div v-if="entityStore.entityAttributes.xp" class="alignRow labelText mb-16">
    Spent XP:
    <BaseFraction
      :top="spentXP"
      :bottom="entityStore.entityAttributes.xp.val"
      class="ml-16"
    ></BaseFraction>
  </div>
  <AbilityTable
    :abilities="entityStore.sortedAbilities"
    :attrs="entityStore.entityAttributes"
  ></AbilityTable>
  <BaseButton
    v-if="entityStore.entity?.entity.id"
    :to="{
      name: ENTITY_ABILITIES_ROUTE,
      params: router.currentRoute.value.params,
      query: { ...router.currentRoute.value.query, new: 'ability' },
    }"
    icon="add"
    class="wide mt-24"
    >Add custom ability</BaseButton
  >
  <AbilitySearch v-if="showEditSection"></AbilitySearch>
  <div class="mb-128"></div>
</template>
<script setup lang="ts">
import AbilitySearch from "@/components/Abilities/AbilitySearch.vue";
import AbilityTable from "@/components/Abilities/AbilityTable.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseFraction from "@/components/Base/BaseFraction.vue";
import router, { ENTITY_ABILITIES_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";
import { actualXPCost } from "@/utils/abilityUtils";
import { computed } from "vue";

const entityStore = useEntityStore();

const spentXP = computed(() =>
  entityStore.entity
    ? entityStore.entity.abilities.reduce(
        (sum, ability) => sum + actualXPCost(ability, entityStore.entity),
        0
      )
    : 0
);

const showEditSection = computed(
  () => entityStore.canEdit && entityStore.entity?.entity.type === "CHARACTER"
);
</script>
