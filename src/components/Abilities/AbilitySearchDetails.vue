<template>
  <h2>Add {{ ability.name }}</h2>
  <DisplayAbilityFull :ability="ability"></DisplayAbilityFull>
  <DisplayAbilityAdditionalDetails
    :ability="ability"
  ></DisplayAbilityAdditionalDetails>
  <AddSearchAbilityButton :ability="ability"></AddSearchAbilityButton>
</template>

<script setup lang="ts">
import type { UncompleteEntityAbility } from "vennt-library";
import DisplayAbilityFull from "./DisplayAbilityFull.vue";
import DisplayAbilityAdditionalDetails from "./DisplayAbilityAdditionalDetails.vue";
import AddSearchAbilityButton from "./AddSearchAbilityButton.vue";

defineProps<{ ability: UncompleteEntityAbility }>();
</script>
