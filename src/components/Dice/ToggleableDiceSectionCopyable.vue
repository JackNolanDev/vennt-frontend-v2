<template>
  <p v-if="header" class="mt-0 mb-0 labelText text-center">
    <b>{{ defaultText && !useDiceAsHeader ? defaultText : dice.roll20 }}</b>
  </p>
  <DiceCopy
    :dice="dice"
    :text="header && defaultText ? dice.roll20 : defaultText"
  ></DiceCopy>
  <DiceToggles
    :attrs="attrs ?? (attr ? [attr] : undefined)"
    :skip-key="skipKey"
  ></DiceToggles>
  <BaseDropDown
    :use-given-state="true"
    :givenClosed="!diceStore.diceDropDown"
    title="Other Dice Options"
    @change="diceStore.toggleDiceDropDown()"
  >
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
import { useEntityStore } from "@/stores/entity";
import { attrFullName, attrShortName } from "@/utils/attributeUtils";
import type { DiceCommands, EntityAttribute } from "vennt-library";
import { combineDiceSettings } from "@/utils/diceUtils";
import { buildDice } from "vennt-library";
import { computed } from "vue";
import HeroPointButton from "../Attributes/HeroPointButton.vue";
import BaseDropDown from "../Base/BaseDropDown.vue";
import CommonDiceSettings from "./CommonDiceSettings.vue";
import DiceCopy from "./DiceCopy.vue";
import DiceToggles from "./DiceToggles.vue";

const props = defineProps<{
  dice: DiceCommands;
  attr?: EntityAttribute;
  attrs?: EntityAttribute[];
  header?: boolean;
  comment?: string;
  skipKey?: string;
  useDiceAsHeader?: boolean;
}>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const defaultText = computed(
  () => props.attr && `${attrShortName(props.attr)} Check Dice`
);

const heroDiceReason = computed(() =>
  props.attr
    ? `Boosted ${attrFullName(props.attr)} dice roll`
    : "Boosted dice roll"
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
        entityStore.entityAttributes
      ),
      `${baseComment} - Hero Point Boost`
    );
  }
  return false;
});
</script>
