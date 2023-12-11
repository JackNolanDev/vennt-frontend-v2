<template>
  <BaseButton @click="rollButton" icon="casino" class="wide selected">
    Roll {{ dice.web }}
  </BaseButton>
  <div class="dice-placeholder">
    <DiceRender
      v-if="showDice"
      :roll-result="diceStore.rolls[rollKey]"
    ></DiceRender>
  </div>
  <DiceToggles
    :attrs="attrs ?? (attr ? [attr] : undefined)"
    :skip-key="skipKey"
  ></DiceToggles>
  <BaseDropDown
    v-if="!hideOtherOptions"
    :use-given-state="true"
    :givenClosed="!diceStore.diceDropDown"
    @change="diceStore.toggleDiceDropDown()"
  >
    <template #closedTitle>Show Other Dice Options</template>
    <template #openTitle>Hide Other Dice Options</template>
    <div v-if="heroPointsUsable && heroPointDice">
      <div class="labelText mt-8 ml-8">Hero Point boost:</div>
      <div class="alignRow split">
        <BaseButton @click="rollHeroButton" icon="casino" class="wide selected">
          Hero point boost
        </BaseButton>
        <HeroPointButton :reason="heroDiceReason"></HeroPointButton>
      </div>
    </div>
    <CommonDiceSettings></CommonDiceSettings>
  </BaseDropDown>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import type { DiceCommands, EntityAttribute } from "vennt-library";
import { buildDice, combineDiceSettings, attrFullName } from "vennt-library";
import { computed, watch } from "vue";
import HeroPointButton from "../Attributes/HeroPointButton.vue";
import BaseDropDown from "../Base/BaseDropDown.vue";
import CommonDiceSettings from "./CommonDiceSettings.vue";
import BaseButton from "../Base/BaseButton.vue";
import DiceRender from "./DiceRender.vue";
import { useEntityStore } from "@/stores/entity";
import DiceToggles from "./DiceToggles.vue";
import { v4 } from "uuid";

const baseId = v4();

const props = defineProps<{
  dice: DiceCommands;
  attr?: EntityAttribute;
  attrs?: EntityAttribute[];
  skipKey?: string;
  hideOtherOptions?: boolean;
}>();
const emit = defineEmits<{ (e: "rollValue", state: number): void }>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const rollKey = computed(() => props.attr ?? baseId);
const heroDiceReason = computed(() =>
  props.attr
    ? `Boosted ${attrFullName(props.attr)} dice roll`
    : "Boosted dice roll",
);

const heroPointsUsable = computed(
  () => entityStore.entity?.entity.type === "CHARACTER",
);
const heroPointDice = computed(() => {
  if (props.dice.settings.count && props.dice.settings.sides) {
    return buildDice(
      props.dice.settings.count,
      props.dice.settings.sides,
      props.dice.settings.adjust,
      combineDiceSettings(
        props.dice.settings,
        { drop: 1, end: "+9" },
        entityStore.computedAttributes,
      ),
      `${props.dice.comment} - Hero Point boosted`,
    );
  }
  return false;
});

const showDice = computed(
  () =>
    diceStore.rolls[rollKey.value] &&
    heroPointDice.value &&
    [props.dice.web, heroPointDice.value.web].includes(
      diceStore.rolls[rollKey.value].notation,
    ),
);

watch(
  () => [diceStore.rolls[rollKey.value]],
  () => {
    if (diceStore.rolls[rollKey.value]) {
      emit("rollValue", diceStore.rolls[rollKey.value].total);
    }
  },
);

const rollButton = () => {
  diceStore.rollDice(props.dice, rollKey.value);
};
const rollHeroButton = () => {
  if (heroPointDice.value) {
    diceStore.rollDice(heroPointDice.value, rollKey.value);
  }
};
</script>
<style scoped>
.dice-placeholder {
  min-height: 40px;
}
</style>
