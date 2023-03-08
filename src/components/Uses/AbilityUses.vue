<template>
  <AbilityInputsUse
    v-if="ability.uses?.inputs"
    :ability="ability"
    :inputs="ability.uses.inputs"
  ></AbilityInputsUse>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import AbilityInputsUse from "./AbilityInputsUse.vue";

defineProps<{ ability: FullEntityAbility }>();
</script>
