<template>
  <div v-if="!onlyShow">
    <BaseCheckBox
      :checked="diceStore.useBuiltinDice"
      :use-toggle="true"
      @click="diceStore.toggleUseBuiltinDice"
      class="wide"
    >
      {{
        diceStore.useBuiltinDice ? "Show Copy Buttons" : "Show Built-in Dice"
      }}
    </BaseCheckBox>
    <div class="separator thin"></div>
  </div>
  <ToggleableDiceSectionRollable
    v-if="onlyShow === 'roll' || diceStore.useBuiltinDice"
    :dice="dice"
    :attr="attr"
    :attrs="attrs"
    :comment="comment"
    :skip-key="skipKey"
    :hide-other-options="hideOtherOptions"
    @roll-value="rollValue"
  ></ToggleableDiceSectionRollable>
  <ToggleableDiceSectionCopyable
    v-else
    :dice="dice"
    :attr="attr"
    :attrs="attrs"
    :comment="comment"
    :header="header"
    :use-dice-as-header="useDiceAsHeader"
    :skip-key="skipKey"
    :hide-other-options="hideOtherOptions"
  ></ToggleableDiceSectionCopyable>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import ToggleableDiceSectionRollable from "./ToggleableDiceSectionRollable.vue";
import type { DiceCommands, EntityAttribute } from "vennt-library";
import ToggleableDiceSectionCopyable from "./ToggleableDiceSectionCopyable.vue";
import BaseCheckBox from "../Base/BaseCheckBox.vue";

defineProps<{
  dice: DiceCommands;
  attr?: EntityAttribute;
  attrs?: EntityAttribute[];
  header?: boolean;
  useDiceAsHeader?: boolean;
  comment?: string;
  skipKey?: string;
  onlyShow?: "roll" | "copy";
  hideOtherOptions?: boolean;
}>();
const emit = defineEmits<{ (e: "rollValue", state: number): void }>();
const diceStore = useDiceStore();

const rollValue = (state: number) => {
  emit("rollValue", state);
};
</script>
