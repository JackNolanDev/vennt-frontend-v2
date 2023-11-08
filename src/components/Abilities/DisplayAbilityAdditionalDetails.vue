<template>
  <p v-if="ability.custom_fields?.purchase" class="mt-16 mb-0">
    <b>Cost:</b> {{ ability.custom_fields.purchase }}
    <i class="no-wrap" v-if="actualCost !== false"
      >(Actual cost: {{ actualCost }} XP<span
        v-if="ability.custom_fields?.times_taken"
        >, taken {{ ability.custom_fields?.times_taken }} times</span
      >)</i
    >
  </p>
  <p v-if="ability.custom_fields?.expedited" class="mt-16 mb-0">
    <b>Expedited for:</b> {{ ability.custom_fields.expedited }}
  </p>
  <p v-if="ability.custom_fields?.unlocks" class="mt-16 mb-0">
    <b class="mr-8">Unlocks:</b>
    <WikiLinksSingleLine
      :line="ability.custom_fields.unlocks"
    ></WikiLinksSingleLine>
  </p>
  <p v-if="ability.custom_fields?.partial_unlocks" class="mt-16 mb-0">
    <b class="mr-8">Partially Unlocked:</b>
    <WikiLinksSingleLine
      :line="ability.custom_fields.partial_unlocks"
    ></WikiLinksSingleLine>
  </p>
  <p v-if="ability.custom_fields?.prereq" class="mt-16 mb-0">
    <b class="mr-8">Prerequisites:</b>
    <WikiLinksSingleLine
      :line="ability.custom_fields.prereq"
    ></WikiLinksSingleLine>
  </p>
  <p v-if="ability.custom_fields?.not_req" class="mt-16 mb-0">
    <i>This ability is not required for the Path Completion Bonus.</i>
  </p>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { actualXPCost, defaultXPCost } from "@/utils/abilityUtils";
import type { EntityAbility } from "vennt-library";
import { computed } from "vue";
import WikiLinksSingleLine from "../Wiki/WikiLinksSingleLine.vue";

const props = defineProps<{ ability: EntityAbility }>();
const entityStore = useEntityStore();

const actualCost = computed(() => {
  const cost = actualXPCost(
    props.ability,
    entityStore.computedAttributes,
    entityStore.entity,
  );
  if (cost === defaultXPCost(props.ability)) {
    return false;
  }
  return cost;
});
</script>
