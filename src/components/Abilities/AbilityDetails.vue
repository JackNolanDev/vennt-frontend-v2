<template>
  <h2>{{ ability.name }}</h2>
  <DisplayAbilityFull :ability="ability"></DisplayAbilityFull>
  <AbilityAdditionalDetailDropdown
    :ability="ability"
    class="mt-16"
  ></AbilityAdditionalDetailDropdown>
  <AbilityDetailsInteractive
    :ability="ability"
    v-if="entityStore.canEdit"
  ></AbilityDetailsInteractive>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import DisplayAbilityFull from "./DisplayAbilityFull.vue";
import AbilityAdditionalDetailDropdown from "./AbilityAdditionalDetailDropdown.vue";
import { useEntityStore } from "@/stores/entity";
import AbilityDetailsInteractive from "./AbilityDetailsInteractive.vue";

defineProps<{ ability: FullEntityAbility }>();
const entityStore = useEntityStore();
</script>
