<template>
  <BaseButton @click="rollButton" icon="casino" class="wide selected">
    Roll {{ dice.web }}
  </BaseButton>
  <DiceRender v-if="showDice" :roll="state.roll"></DiceRender>
  <BaseDropDown
    :use-given-state="true"
    :givenClosed="!diceStore.diceDropDown"
    @change="diceStore.toggleDiceDropDown()"
  >
    <template #closedTitle>Show Other Dice Options</template>
    <template #openTitle>Hide Other Dice Options</template>
    <div v-if="heroPointDice">
      <div class="labelText mt-8 ml-8">Hero Point boost:</div>
      <div class="alignRow split">
        <BaseButton @click="rollHeroButton" icon="casino" class="wide selected">
          Hero point boost
        </BaseButton>
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
import { computed, reactive } from "vue";
import HeroPointButton from "../Attributes/HeroPointButton.vue";
import BaseDropDown from "../Base/BaseDropDown.vue";
import CommonDiceSettings from "./CommonDiceSettings.vue";
import BaseButton from "../Base/BaseButton.vue";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import DiceRender from "./DiceRender.vue";

const props = defineProps<{ dice: DiceCommands; attr?: EntityAttribute }>();
const state = reactive<{ roll?: DiceRoll }>({ roll: undefined });
const emit = defineEmits<{ (e: "rollValue", state: number): void }>();
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

const showDice = computed(
  () =>
    state.roll &&
    heroPointDice.value &&
    [props.dice.web, heroPointDice.value.web].includes(state.roll.notation)
);

const rollButton = () => {
  state.roll = new DiceRoll(props.dice.web);
  emit("rollValue", state.roll.total);
};
const rollHeroButton = () => {
  if (heroPointDice.value) {
    state.roll = new DiceRoll(heroPointDice.value.web);
    emit("rollValue", state.roll.total);
  }
};
</script>
