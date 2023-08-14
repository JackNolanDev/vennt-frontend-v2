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
import {
  abilityExtendEntityAttributes,
  abilityUseAdjustments,
  abilityUsable,
  canAffordAdjustments,
} from "@/utils/abilityUtils";
import { adjustAttrsAPI, attrShortName } from "@/utils/attributeUtils";
import type { FullEntityAbility } from "@/utils/backendTypes";
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
const additionalAdjustments = computed((): Record<string, number> => {
  if (props.spellIdx === undefined || !props.ability.custom_fields?.mp_cost) {
    return {};
  }
  return { mp: -props.ability.custom_fields.mp_cost[props.spellIdx] };
});
const extendedAttributes = computed(() =>
  abilityExtendEntityAttributes(props.ability, entityStore.entityAttributes)
);
const abilityAdjustments = computed(() =>
  abilityUseAdjustments(
    props.ability,
    extendedAttributes.value,
    additionalAdjustments.value
  )
);

const useButtonDisabled = computed(
  () =>
    !abilityUsable(props.ability) ||
    !canAffordAdjustments(
      abilityAdjustments.value,
      extendedAttributes.value,
      entityStore.entity?.entity.other_fields.in_combat
    )
);
const useButtonTitle = computed(() => {
  const costs: string[] = [];
  const gives: string[] = [];
  Object.entries(abilityAdjustments.value).forEach(([attr, adjust]) => {
    if (adjust > 0) {
      gives.push(`${adjust} ${attrShortName(attr)}`);
    } else {
      costs.push(`${-adjust} ${attrShortName(attr)}`);
    }
  });
  const costsString =
    costs.length > 0 ? `Costs: ${costs.join(", ")}` : "Costs nothing";
  const givesString = gives.length > 0 ? `\nGives: ${gives.join(", ")}` : "";
  return `${costsString}${givesString}`;
});

const useButton = () => {
  if (!entityStore.entity) {
    return;
  }
  const prefix = props.spellIdx
    ? ["Half Casted", "Regular Casted", "Double Casted"][props.spellIdx]
    : "Used";
  adjustAttrsAPI(
    entityStore.entity,
    entityStore.entityAttributes,
    abilityAdjustments.value,
    `${prefix} ${props.ability.name}`,
    true,
    true
  );
};
</script>
