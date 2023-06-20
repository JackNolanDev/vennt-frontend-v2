<template>
  <p
    v-if="ability.custom_fields?.path && !hiddenFields?.path"
    class="mt-16 mb-0 text-block"
  >
    <i>{{ ability.custom_fields.path }}</i>
  </p>
  <DisplayAbilityUseCost :ability="ability"></DisplayAbilityUseCost>
  <div v-if="ability.custom_fields?.range" class="mt-16 mb-0 text-block">
    <b>Range:</b> {{ ability.custom_fields.range }}
  </div>
  <div v-if="!hiddenFields?.effect">
    <p class="mt-16 mb-0 text-block"><b>Effect:</b></p>
    <DisplayAbilityEffect
      :ability="ability"
      :flavor="true"
      :attrs="attrs"
    ></DisplayAbilityEffect>
  </div>
</template>

<script setup lang="ts">
import type {
  EntityAbility,
  UpdatedEntityAttributes,
} from "@/utils/backendTypes";
import DisplayAbilityEffect from "./DisplayAbilityEffect.vue";
import DisplayAbilityUseCost from "./DisplayAbilityUseCost.vue";

defineProps<{
  ability: EntityAbility;
  attrs?: UpdatedEntityAttributes;
  hiddenFields?: {
    path?: boolean;
    effect?: boolean;
  };
}>();
</script>
