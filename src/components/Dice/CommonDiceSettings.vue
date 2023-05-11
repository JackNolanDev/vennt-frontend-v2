<template>
  <div>
    <div class="labelText mt-8 ml-8 mb-8">Other common settings:</div>
    <div class="alignRow gap mb-2">
      <input
        type="number"
        inputmode="numeric"
        placeholder="0"
        min="0"
        v-model.number="diceStore.defaultDiceSettings.flow"
        title="Amount of flow to use in dice rolls"
        id="dice-settings-flow"
        class="input tiny ml-8"
      />
      <label for="dice-settings-flow" class="labelText">Flow</label>
    </div>
    <div class="alignRow gap mb-2">
      <input
        type="number"
        inputmode="numeric"
        placeholder="0"
        min="0"
        v-model.number="diceStore.defaultDiceSettings.ebb"
        title="Amount of ebb to use in dice rolls"
        id="dice-settings-ebb"
        class="input tiny ml-8"
      />
      <label for="dice-settings-ebb" class="labelText">Ebb</label>
    </div>
    <BaseCheckBox
      :checked="!!diceStore.defaultDiceSettings.rr1s"
      :highlight="true"
      @click="toggleRr1s"
      class="wide"
      >Re-roll 1s</BaseCheckBox
    >
  </div>
</template>
<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import BaseCheckBox from "../Base/BaseCheckBox.vue";

const diceStore = useDiceStore();

const toggleRr1s = () => {
  diceStore.defaultDiceSettings.rr1s = !diceStore.defaultDiceSettings.rr1s;
};
</script>
