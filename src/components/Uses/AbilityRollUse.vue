<template>
  <div v-if="dice" class="card column">
    <ToggleableDiceSection
      :dice="dice"
      :comment="diceComment"
      @roll-value="(value) => (state.rollValue = value.toString())"
    ></ToggleableDiceSection>
    <div class="separator thin mt-8"></div>
    <div class="mt-8 mb-8 ml-8 mr-8">
      <div class="alignRow gap">
        <label for="ability-roll-value" class="labelText nowrap">
          Roll value:
        </label>
        <input
          type="number"
          placeholder="Roll Result"
          v-model="state.rollValue"
          id="ability-roll-value"
          class="input nameInput"
        />
      </div>
      <BaseButton
        @click="useAbility"
        :disabled="buttonDisabled"
        title="Uses the ability. Takes the cost of the ability but gives you the result of your dice roll."
        class="primary wide mt-8"
      >
        Use ability
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import type {
  FullEntityAbility,
  PartialEntityAttributes,
} from "@/utils/backendTypes";
import ToggleableDiceSection from "../Dice/ToggleableDiceSection.vue";
import { computed, reactive } from "vue";
import { useDiceStore } from "@/stores/dice";
import { diceParseFromString } from "@/utils/diceUtils";
import BaseButton from "../Base/BaseButton.vue";
import { adjustAttrsAPI, solvePendingEquations } from "@/utils/attributeUtils";
import { abilityUsedStats } from "@/utils/abilityUtils";

const props = defineProps<{ ability: FullEntityAbility }>();
const state = reactive({ rollValue: "" });
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const diceComment = computed(() => `Used ${props.ability.name}`);
const dice = computed(
  () =>
    props.ability.uses?.roll &&
    diceParseFromString(
      props.ability.uses.roll.dice,
      diceStore.defaultDiceSettings,
      diceComment.value
    )
);
const adjust = computed(() => {
  const parsedValue = parseInt(state.rollValue);
  return isNaN(parsedValue) ? 0 : parsedValue;
});
const buttonDisabled = computed(
  () =>
    adjust.value === 0 ||
    ((entityStore.entity?.entity.other_fields.disabled_actions ?? {})[
      props.ability.name
    ]?.length ?? 0) > 0
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
        entityStore.entityAttributes
      ),
    };
  }
  adjustAttrsAPI(
    entityStore.entity,
    entityStore.entityAttributes,
    adjustAttrs,
    {
      msg: `Used ${props.ability.name}`,
      enforceMaximums: true,
      src: props.ability.name,
    }
  );
};
</script>
