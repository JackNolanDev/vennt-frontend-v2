<template>
  <UseAbilityButton :ability="ability" :optional-heal="true"></UseAbilityButton>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import UseAbilityButton from "../Abilities/UseAbilityButton.vue";

defineProps<{ ability: FullEntityAbility }>();
</script>
