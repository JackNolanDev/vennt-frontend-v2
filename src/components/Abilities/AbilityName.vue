<template>
  <span class="alignRow"
    ><span
      v-if="
        (showHighlight && ability.custom_fields?.highlight) ||
        ability.custom_fields?.stars
      "
      :title="
        ability.custom_fields?.stars
          ? 'Favorited'
          : ability.custom_fields.highlight
      "
      class="material-symbols-outlined defaultSize mr-8 highlight"
      :class="showHighlight && ability.custom_fields?.highlight"
      >{{ ability.custom_fields?.stars ? "star" : "" }}</span
    >
    <RouterLink
      v-if="linkOnName && (ability as FullEntityAbility).id"
      :to="abilityRoute(ability as FullEntityAbility)"
      class="stealth"
      >{{ improveTextForDisplay(ability.name) }}</RouterLink
    >
    <span v-else>{{ improveTextForDisplay(ability.name) }}</span>
  </span>
</template>

<script setup lang="ts">
import router, { ENTITY_ABILITIES_ROUTE } from "@/router";
import type { EntityAbility, FullEntityAbility } from "vennt-library";
import { improveTextForDisplay } from "@/utils/textUtils";
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  ability: EntityAbility;
  linkOnName?: boolean;
  showHighlight?: boolean;
}>();

const abilityRoute = (ability: FullEntityAbility): RouteLocationRaw => {
  return {
    name: ENTITY_ABILITIES_ROUTE,
    params: { detail: ability.id },
    query: router.currentRoute.value.query,
  };
};
</script>

<style scoped>
.highlight {
  width: 24px;
  height: 24px;
  border-radius: 2px;
}
</style>
