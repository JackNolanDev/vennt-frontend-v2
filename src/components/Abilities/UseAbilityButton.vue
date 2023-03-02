<template>
  <BaseButton
    :disabled="useButtonDisabled"
    :title="useButtonTitle"
    @click="useButton"
    class="primary center wide mt-8"
    >{{ useButtonText }}</BaseButton
  >
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { abilityUsedStats, canUseAbility } from "@/utils/abilityUtils";
import { adjustAttrsAPI, attrShortName } from "@/utils/attributeUtils";
import type {
  FullEntityAbility,
  PartialEntityAttributes,
} from "@/utils/backendTypes";
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{ ability: FullEntityAbility; spellIdx?: number }>();
const entityStore = useEntityStore();

const useButtonText = computed(() => {
  if (props.spellIdx === undefined) {
    return "Use Ability";
  }
  return ["Half Cast", "Regular Cast", "Double Cast"][props.spellIdx];
});
const additionalCost = computed(() => {
  if (props.spellIdx === undefined || !props.ability.custom_fields?.mp_cost) {
    return {};
  }
  return { mp: props.ability.custom_fields.mp_cost[props.spellIdx] };
});
const abilityCost = computed(() => ({
  ...props.ability.custom_fields?.cost,
  ...additionalCost.value,
}));
const useButtonDisabled = computed(
  () =>
    !canUseAbility(
      props.ability,
      entityStore.entityAttributes,
      additionalCost.value
    )
);
const useButtonTitle = computed(() => {
  const uses: string[] = [];
  abilityUsedStats.forEach((attr) => {
    const costStat = abilityCost.value[attr];
    if (costStat) {
      uses.push(`${costStat} ${attrShortName(attr)}`);
    }
  });
  return `Costs: ${uses.length > 0 ? uses.join(", ") : "nothing"}`;
});

const useButton = () => {
  if (!entityStore.entity) {
    return;
  }
  const adjustAttrs: PartialEntityAttributes = {};
  abilityUsedStats.forEach((attr) => {
    const costStat = abilityCost.value[attr];
    if (costStat) {
      adjustAttrs[attr] = -costStat;
    }
  });
  const prefix = props.spellIdx
    ? ["Half Casted", "Regular Casted", "Double Casted"][props.spellIdx]
    : "Used";
  adjustAttrsAPI(
    entityStore.entity,
    adjustAttrs,
    `${prefix} ${props.ability.name}`
  );
};
</script>
