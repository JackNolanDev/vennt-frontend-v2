<template>
  <AbilityInputsUse
    v-if="ability.uses?.inputs"
    :ability="ability"
    :inputs="ability.uses.inputs"
  ></AbilityInputsUse>
  <AbilityRollUse v-if="ability.uses?.roll" :ability="ability"></AbilityRollUse>
  <CheckUse v-if="ability.uses?.check" :use="ability.uses.check"></CheckUse>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import AbilityInputsUse from "./AbilityInputsUse.vue";
import AbilityRollUse from "./AbilityRollUse.vue";
import CheckUse from "./CheckUse.vue";

defineProps<{ ability: FullEntityAbility }>();
</script>
