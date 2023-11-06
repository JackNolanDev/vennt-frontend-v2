<template>
  <div v-for="input in inputs" :key="input.key">
    <AbilityInputsRadioUse
      v-if="input.type === 'radio'"
      :ability="ability"
      :input="input"
    ></AbilityInputsRadioUse>
    <AbilityInputsTextUse
      v-else-if="input.type === 'text'"
      :ability="ability"
      :input="input"
    ></AbilityInputsTextUse>
    <AbilityInputsNumberUse
      v-else-if="input.type === 'number'"
      :ability="ability"
      :input="input"
    ></AbilityInputsNumberUse>
  </div>
</template>

<script setup lang="ts">
import AbilityInputsRadioUse from "./AbilityInputsRadioUse.vue";
import AbilityInputsTextUse from "./AbilityInputsTextUse.vue";
import type { FullEntityAbility, UseInputs } from "vennt-library";
import AbilityInputsNumberUse from "./AbilityInputsNumberUse.vue";

defineProps<{ ability: FullEntityAbility; inputs?: UseInputs }>();
</script>
