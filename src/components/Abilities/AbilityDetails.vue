<template>
  <h2>{{ ability.name }}</h2>
  <DisplayAbilityFull :ability="ability"></DisplayAbilityFull>
  <AbilityAdditionalDetailDropdown
    :ability="ability"
    class="mt-16"
  ></AbilityAdditionalDetailDropdown>
  <AbilityComment :ability="ability"></AbilityComment>
  <div class="seperator mt-16 mb-16"></div>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import DisplayAbilityFull from "./DisplayAbilityFull.vue";
import AbilityAdditionalDetailDropdown from "./AbilityAdditionalDetailDropdown.vue";
import AbilityComment from "./AbilityComment.vue";

defineProps<{ ability: FullEntityAbility }>();
</script>
