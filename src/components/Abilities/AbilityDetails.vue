<template>
  <h2>{{ ability.name }}</h2>
  <DisplayAbilityFull :ability="ability"></DisplayAbilityFull>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import DisplayAbilityFull from "./DisplayAbilityFull.vue";

defineProps<{ ability: FullEntityAbility }>();
</script>
