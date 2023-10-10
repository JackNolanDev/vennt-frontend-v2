<template>
  <div class="card column">
    <div v-if="title" class="tableItems noHeader padded">
      <h3 class="mt-0 mb-0 text-center">{{ title }}</h3>
    </div>
    <div
      v-for="(ability, index) in abilities"
      v-bind:key="ability.name + index"
      class="tableItems noHeader padded"
    >
      <h3 class="mt-0 mb-8">
        <AbilityName
          :ability="ability"
          :link-on-name="linkOnName"
          :show-highlight="true"
        ></AbilityName>
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
import { useEntityStore } from "@/stores/entity";
import type { EntityAbility, FullEntityAbility } from "@/utils/backendTypes";
import DisplayAbilityEffect from "./DisplayAbilityEffect.vue";
import DisplayAbilityUseCost from "./DisplayAbilityUseCost.vue";
import AbilityUses from "../Uses/AbilityUses.vue";
import UseAbilitySection from "./UseAbilitySection.vue";
import AbilityName from "./AbilityName.vue";

defineProps<{
  abilities: EntityAbility[];
  linkOnName?: boolean;
  showUses?: boolean;
  title?: string;
}>();
const entityStore = useEntityStore();
</script>
