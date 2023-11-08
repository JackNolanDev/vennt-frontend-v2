<template>
  <BaseDropDown v-if="visible" title="Additional Details">
    <div class="ml-8 mr-8 mb-16">
      <DisplayAbilityAdditionalDetails
        :ability="ability"
      ></DisplayAbilityAdditionalDetails>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import type { EntityAbility, EntityAbilityFields } from "vennt-library";
import BaseDropDown from "../Base/BaseDropDown.vue";
import DisplayAbilityAdditionalDetails from "./DisplayAbilityAdditionalDetails.vue";
import { computed } from "vue";

const props = defineProps<{ ability: EntityAbility }>();

const additionalDetailsKeys: EntityAbilityFields[] = [
  "purchase",
  "expedited",
  "unlocks",
  "partial_unlocks",
  "prereq",
  "not_req",
];
const visible = computed(
  () =>
    props.ability.custom_fields &&
    additionalDetailsKeys.some(
      (key) =>
        props.ability.custom_fields && key in props.ability.custom_fields,
    ),
);
</script>
