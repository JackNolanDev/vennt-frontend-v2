<template>
  <AbilityInputsUse
    v-if="ability.uses?.inputs"
    :ability="ability"
    :inputs="ability.uses.inputs"
  ></AbilityInputsUse>
  <AbilityRollUse v-if="ability.uses?.roll" :ability="ability"></AbilityRollUse>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import AbilityInputsUse from "./AbilityInputsUse.vue";
import AbilityRollUse from "./AbilityRollUse.vue";

defineProps<{ ability: FullEntityAbility }>();
</script>
