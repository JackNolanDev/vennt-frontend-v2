<template>
  <BaseButton
    v-if="diceStore.useBuiltinDice"
    @click="diceStore.toggleUseBuiltinDice"
    icon="toggle_off"
    class="wide"
  >
    Show Copy Buttons
  </BaseButton>
  <BaseButton
    v-else
    @click="diceStore.toggleUseBuiltinDice"
    icon="toggle_on"
    class="wide"
  >
    Show Built-in Dice
  </BaseButton>
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
import BaseButton from "../Base/BaseButton.vue";
import ToggleableDiceSectionRollable from "./ToggleableDiceSectionRollable.vue";
import type { DiceCommands, EntityAttribute } from "@/utils/backendTypes";
import ToggleableDiceSectionCopyable from "./ToggleableDiceSectionCopyable.vue";

defineProps<{ dice: DiceCommands; attr?: EntityAttribute }>();
const emit = defineEmits<{ (e: "rollValue", state: number): void }>();
const diceStore = useDiceStore();

const rollValue = (state: number) => {
  emit("rollValue", state);
};
</script>
