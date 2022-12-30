<template>
  <BaseCheckBox
    :checked="diceStore.useBuiltinDice"
    :use-toggle="true"
    class="wide"
  >
    {{ diceStore.useBuiltinDice ? "Show Copy Buttons" : "Show Built-in Dice" }}
  </BaseCheckBox>
  <div class="seperator thin"></div>
  <ToggleableDiceSectionRollable
    v-if="diceStore.useBuiltinDice"
    :dice="dice"
    :attr="attr"
    @roll-value="rollValue"
  ></ToggleableDiceSectionRollable>
  <ToggleableDiceSectionCopyable
    v-else
    :dice="dice"
    :attr="attr"
  ></ToggleableDiceSectionCopyable>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import ToggleableDiceSectionRollable from "./ToggleableDiceSectionRollable.vue";
import type { DiceCommands, EntityAttribute } from "@/utils/backendTypes";
import ToggleableDiceSectionCopyable from "./ToggleableDiceSectionCopyable.vue";
import BaseCheckBox from "../Base/BaseCheckBox.vue";

defineProps<{ dice: DiceCommands; attr?: EntityAttribute }>();
const emit = defineEmits<{ (e: "rollValue", state: number): void }>();
const diceStore = useDiceStore();

const rollValue = (state: number) => {
  emit("rollValue", state);
};
</script>
