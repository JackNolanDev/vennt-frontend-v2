<template>
  <BaseButton
    :disabled="useButtonDisabled"
    :title="useButtonTitle"
    @click="useButton"
    class="primary center wide mt-8"
    ><div class="wrap text-center">{{ useButtonText }}</div></BaseButton
  >
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import {
  abilityUseAdjustments,
  abilityUsable,
  canAffordAdjustments,
} from "@/utils/abilityUtils";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import {
  abilityExtendEntityAttributes,
  attrShortName,
  type FullEntityAbility,
} from "vennt-library";
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{
  ability: FullEntityAbility;
  spellIdx?: number;
  optionalHealIdx?: number;
}>();
const entityStore = useEntityStore();

const useButtonText = computed(() => {
  let optionalHealText = "";
  if (
    typeof props.optionalHealIdx === "number" &&
    props.ability.uses?.optional_heal &&
    props.ability.uses.optional_heal[props.optionalHealIdx]
  ) {
    const healText =
      props.ability.uses.optional_heal[props.optionalHealIdx].label ??
      "With Optional Heal";
    optionalHealText = ` - ${healText}`;
  }
  if (props.spellIdx === undefined) {
    return "Use Ability" + optionalHealText;
  }
  return (
    ["Half Cast", "Regular Cast", "Double Cast"][props.spellIdx] +
    optionalHealText
  );
});
const additionalAdjustments = computed((): Record<string, number> => {
  if (props.spellIdx === undefined || !props.ability.custom_fields?.mp_cost) {
    return {};
  }
  return { mp: -props.ability.custom_fields.mp_cost[props.spellIdx] };
});
const extendedAttributes = computed(() =>
  abilityExtendEntityAttributes(props.ability, entityStore.computedAttributes),
);
const abilityAdjustments = computed(() =>
  abilityUseAdjustments(
    props.ability,
    extendedAttributes.value,
    additionalAdjustments.value,
    props.optionalHealIdx,
  ),
);

const useButtonDisabled = computed(
  () =>
    ((entityStore.entity?.entity.other_fields.disabled_actions ?? {})[
      props.ability.name
    ]?.length ?? 0) > 0 ||
    !abilityUsable(props.ability) ||
    !canAffordAdjustments(
      abilityAdjustments.value,
      extendedAttributes.value,
      entityStore.inCombat,
    ),
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
    entityStore.computedAttributes,
    abilityAdjustments.value,
    {
      msg: `${prefix} ${props.ability.name}`,
      enforceMaximums: true,
      src: props.ability.name,
    },
  );
  if (
    props.ability.uses?.adjust &&
    props.ability.uses.adjust.time !== "permanent"
  ) {
    entityStore.updateAbility(props.ability.id, { active: true });
  }
};
</script>
