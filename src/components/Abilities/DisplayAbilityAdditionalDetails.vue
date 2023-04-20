<template>
  <p v-if="ability.custom_fields?.purchase" class="mt-16 mb-0">
    <b>Cost:</b> {{ ability.custom_fields.purchase }}
    <i v-if="actualCost">(Actual cost: {{ actualCost }} XP)</i>
  </p>
  <p v-if="ability.custom_fields?.expedited" class="mt-16 mb-0">
    <b>Expedited for:</b> {{ ability.custom_fields.expedited }}
  </p>
  <p v-if="ability.custom_fields?.unlocks" class="mt-16 mb-0">
    <b>Unlocks:</b> {{ ability.custom_fields.unlocks }}
  </p>
  <p v-if="ability.custom_fields?.partial_unlocks" class="mt-16 mb-0">
    <b>Partially Unlocked:</b> {{ ability.custom_fields.partial_unlocks }}
  </p>
  <p v-if="ability.custom_fields?.prereq" class="mt-16 mb-0">
    <b>Prerequisites:</b> {{ ability.custom_fields.prereq }}
  </p>
  <p v-if="ability.custom_fields?.not_req" class="mt-16 mb-0">
    This ability is not required for the Path Completion Bonus.
  </p>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { actualXPCost, defaultXPCost } from "@/utils/abilityUtils";
import type { EntityAbility } from "@/utils/backendTypes";
import { computed } from "vue";

const props = defineProps<{ ability: EntityAbility }>();
const entityStore = useEntityStore();

const actualCost = computed(() => {
  const cost = actualXPCost(
    props.ability,
    entityStore.entityAttributes,
    entityStore.entity
  );
  if (cost === defaultXPCost(props.ability)) {
    return false;
  }
  return cost;
});
</script>
