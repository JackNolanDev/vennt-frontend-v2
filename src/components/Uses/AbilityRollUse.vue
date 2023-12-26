<template>
  <RollDiceInput
    v-if="dice"
    v-model="state.rollValue"
    :dice="dice"
    input-placeholder="Roll Result"
  >
    <template #innerForm
      ><BaseButton
        @click="useAbility"
        :disabled="buttonDisabled"
        title="Uses the ability. Consumes the cost of the ability but gives you the result of your dice roll."
        class="primary wide mt-8"
      >
        Use ability
      </BaseButton></template
    >
  </RollDiceInput>
</template>

<script setup lang="ts">
import BaseButton from "../Base/BaseButton.vue";
import RollDiceInput from "../Dice/RollDiceInput.vue";
import { useEntityStore } from "@/stores/entity";
import {
  type FullEntityAbility,
  type PartialEntityAttributes,
  diceParseFromString,
  solvePendingEquations,
} from "vennt-library";
import { computed, reactive } from "vue";
import { useDiceStore } from "@/stores/dice";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import { abilityUsedStats } from "@/utils/abilityUtils";
import { numberFieldVal } from "@/utils/inputType";

const props = defineProps<{ ability: FullEntityAbility }>();
const state = reactive({ rollValue: "" });
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const dice = computed(
  () =>
    props.ability.uses?.roll &&
    diceParseFromString(
      props.ability.uses.roll.dice,
      diceStore.defaultDiceSettings,
      `Used ${props.ability.name}`,
    ),
);
const adjust = computed(() => numberFieldVal(state.rollValue));
const buttonDisabled = computed(
  () =>
    adjust.value === 0 ||
    ((entityStore.entity?.entity.other_fields.disabled_actions ?? {})[
      props.ability.name
    ]?.length ?? 0) > 0,
);

const useAbility = () => {
  if (!entityStore.entity || !props.ability.uses?.roll?.attr) {
    return;
  }
  let adjustAttrs: PartialEntityAttributes = {
    [props.ability.uses.roll.attr]: adjust.value,
  };
  abilityUsedStats.forEach((attr) => {
    const costStat = (props.ability.custom_fields?.cost ?? {})[attr];
    if (costStat) {
      adjustAttrs[attr] = -costStat;
    }
  });
  if (props.ability.uses.roll.heal) {
    adjustAttrs = {
      ...adjustAttrs,
      ...solvePendingEquations(
        props.ability.uses.roll.heal,
        entityStore.computedAttributes,
      ),
    };
  }
  adjustAttrsAPI(
    entityStore.entity,
    entityStore.computedAttributes,
    adjustAttrs,
    {
      msg: `Used ${props.ability.name}`,
      enforceMaximums: true,
      src: props.ability.name,
    },
  );
};
</script>
