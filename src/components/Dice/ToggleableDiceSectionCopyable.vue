<template>
  <DiceCopy :dice="dice"></DiceCopy>
  <BaseDropDown
    :givenClosed="!diceStore.diceDropDown"
    @change="diceStore.toggleDiceDropDown()"
  >
    <template #closedTitle>Show Other Dice Options</template>
    <template #openTitle>Hide Other Dice Options</template>
    <div v-if="heroPointDice">
      <div class="labelText mt-8 ml-8">Hero Point boost:</div>
      <div class="alignRow split">
        <DiceCopy :dice="heroPointDice"></DiceCopy>
        <HeroPointButton :reason="heroDiceReason"></HeroPointButton>
      </div>
      <CommonDiceSettings></CommonDiceSettings>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import { attrFullName } from "@/utils/attributeUtils";
import type { DiceCommands, EntityAttribute } from "@/utils/backendTypes";
import { buildDice } from "@/utils/diceUtils";
import { computed } from "vue";
import HeroPointButton from "../Attributes/HeroPointButton.vue";
import BaseDropDown from "../Base/BaseDropDown.vue";
import CommonDiceSettings from "./CommonDiceSettings.vue";
import DiceCopy from "./DiceCopy.vue";

const props = defineProps<{ dice: DiceCommands; attr?: EntityAttribute }>();
const diceStore = useDiceStore();

const heroDiceReason = computed(() =>
  props.attr
    ? `Boosted ${attrFullName(props.attr)} dice roll`
    : "Boosted dice roll"
);
const heroPointDice = computed(() => {
  if (props.dice.settings.count && props.dice.settings.sides) {
    return buildDice(
      props.dice.settings.count,
      props.dice.settings.sides,
      props.dice.settings.adjust,
      {
        ...props.dice.settings,
        drop: 1,
        end: "+9",
      }
    );
  }
  return false;
});
</script>
