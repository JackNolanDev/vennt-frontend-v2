<template>
  <h2>Add {{ ability.name }}</h2>
  <DisplayAbilityFull :ability="ability"></DisplayAbilityFull>
  <DisplayAbilityAdditionalDetails
    :ability="ability"
  ></DisplayAbilityAdditionalDetails>
  <BaseButton icon="add" class="primary wide mt-24">Add ability</BaseButton>
</template>

<script setup lang="ts">
import type { UncompleteEntityAbility } from "@/utils/backendTypes";
import DisplayAbilityFull from "./DisplayAbilityFull.vue";
import DisplayAbilityAdditionalDetails from "./DisplayAbilityAdditionalDetails.vue";
import BaseButton from "../Base/BaseButton.vue";

defineProps<{ ability: UncompleteEntityAbility }>();
</script>
