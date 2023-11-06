<template>
  <BaseCheckBox
    :checked="diceStore.useBuiltinDice"
    :use-toggle="true"
    @click="diceStore.toggleUseBuiltinDice"
    class="wide"
  >
    {{ diceStore.useBuiltinDice ? "Show Copy Buttons" : "Show Built-in Dice" }}
  </BaseCheckBox>
  <div class="separator thin"></div>
  <ToggleableDiceSectionRollable
    v-if="diceStore.useBuiltinDice"
    :dice="dice"
    :attr="attr"
    :comment="comment"
    :skip-key="skipKey"
    @roll-value="rollValue"
  ></ToggleableDiceSectionRollable>
  <ToggleableDiceSectionCopyable
    v-else
    :dice="dice"
    :attr="attr"
    :comment="comment"
    :skip-key="skipKey"
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
  comment?: string;
  skipKey?: string;
}>();
const emit = defineEmits<{ (e: "rollValue", state: number): void }>();
const diceStore = useDiceStore();

const rollValue = (state: number) => {
  emit("rollValue", state);
};
</script>
