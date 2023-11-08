<template>
  <BaseButton @click="rollButton" icon="casino" class="wide selected">
    Roll {{ dice.web }}
  </BaseButton>
  <DiceRender v-if="showDice" :roll="state.roll"></DiceRender>
  <DiceToggles :attr="attr" :skip-key="skipKey"></DiceToggles>
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
import type { DiceCommands, EntityAttribute } from "vennt-library";
import {
  buildDice,
  combineDiceSettings,
  attrFullName,
  attrShortName,
} from "vennt-library";
import { computed, reactive } from "vue";
import HeroPointButton from "../Attributes/HeroPointButton.vue";
import BaseDropDown from "../Base/BaseDropDown.vue";
import CommonDiceSettings from "./CommonDiceSettings.vue";
import BaseButton from "../Base/BaseButton.vue";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import DiceRender from "./DiceRender.vue";
import { useEntityStore } from "@/stores/entity";
import DiceToggles from "./DiceToggles.vue";

const props = defineProps<{
  dice: DiceCommands;
  attr?: EntityAttribute;
  comment?: string;
  skipKey?: string;
}>();
const state = reactive<{ roll?: DiceRoll }>({ roll: undefined });
const emit = defineEmits<{ (e: "rollValue", state: number): void }>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const heroDiceReason = computed(() =>
  props.attr
    ? `Boosted ${attrFullName(props.attr)} dice roll`
    : "Boosted dice roll",
);
const heroPointDice = computed(() => {
  if (props.dice.settings.count && props.dice.settings.sides) {
    let baseComment = "dice check";
    if (props.attr) {
      baseComment = `${attrShortName(props.attr)} check`;
    }
    if (props.comment) {
      baseComment = props.comment;
    }
    return buildDice(
      props.dice.settings.count,
      props.dice.settings.sides,
      props.dice.settings.adjust,
      combineDiceSettings(
        props.dice.settings,
        { drop: 1, end: "+9" },
        entityStore.computedAttributes,
      ),
      `${baseComment} - Hero Point Boost`,
    );
  }
  return false;
});

const showDice = computed(
  () =>
    state.roll &&
    heroPointDice.value &&
    [props.dice.web, heroPointDice.value.web].includes(state.roll.notation),
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
