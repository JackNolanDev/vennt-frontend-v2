<template>
  <div :class="{ border: showBorder }" class="card column">
    <div
      v-for="(ability, index) in abilities"
      v-bind:key="ability.name + index"
      class="tableItems noHeader padded"
    >
      <h3 class="mt-0 mb-8">
        <RouterLink
          v-if="linkOnName && (ability as FullEntityAbility).id"
          :to="abilityRoute(ability as FullEntityAbility)"
          class="stealth"
          >{{ improveTextForDisplay(ability.name) }}</RouterLink
        ><span v-else>{{ improveTextForDisplay(ability.name) }}</span>
      </h3>
      <p class="mt-0 mb-0 condense-child-text">
        <DisplayAbilityUseCost :ability="ability"></DisplayAbilityUseCost>
        <DisplayAbilityEffect
          :ability="ability"
          :attrs="entityStore.entityAttributes"
        ></DisplayAbilityEffect>
        <AbilityUses
          v-if="showUses && (ability as FullEntityAbility).id"
          :ability="(ability as FullEntityAbility)"
        ></AbilityUses>
        <UseAbilitySection
          v-if="showUses && (ability as FullEntityAbility).id"
          :ability="(ability as FullEntityAbility)"
        ></UseAbilitySection>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import router, { ENTITY_ABILITIES_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";
import type { EntityAbility, FullEntityAbility } from "@/utils/backendTypes";
import { improveTextForDisplay } from "@/utils/textUtils";
import { type RouteLocationRaw, RouterLink } from "vue-router";
import DisplayAbilityEffect from "./DisplayAbilityEffect.vue";
import DisplayAbilityUseCost from "./DisplayAbilityUseCost.vue";
import AbilityUses from "../Uses/AbilityUses.vue";
import UseAbilitySection from "./UseAbilitySection.vue";

defineProps<{
  abilities: EntityAbility[];
  linkOnName?: boolean;
  showUses?: boolean;
  showBorder?: boolean;
}>();
const entityStore = useEntityStore();

const abilityRoute = (ability: FullEntityAbility): RouteLocationRaw => {
  return {
    name: ENTITY_ABILITIES_ROUTE,
    params: { detail: ability.id },
    query: router.currentRoute.value.query,
  };
};
</script>
