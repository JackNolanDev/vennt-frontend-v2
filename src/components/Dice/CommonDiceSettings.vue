<template>
  <div>
    <div class="labelText mt-8 ml-8">Other common settings:</div>
    <BaseCheckBox
      :checked="!!diceStore.defaultDiceSettings.flow"
      :highlight="true"
      @click="toggleDiceSetting('flow')"
      class="wide"
      >Flow</BaseCheckBox
    >
    <BaseCheckBox
      :checked="!!diceStore.defaultDiceSettings.ebb"
      :highlight="true"
      @click="toggleDiceSetting('ebb')"
      class="wide"
      >Ebb</BaseCheckBox
    >
    <BaseCheckBox
      :checked="!!diceStore.defaultDiceSettings.rr1s"
      :highlight="true"
      @click="toggleDiceSetting('rr1s')"
      class="wide"
      >Re-roll All 1s</BaseCheckBox
    >
  </div>
</template>
<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import BaseCheckBox from "../Base/BaseCheckBox.vue";

const diceStore = useDiceStore();

const toggleDiceSetting = (setting: "flow" | "ebb" | "rr1s") => {
  diceStore.defaultDiceSettings[setting] =
    !diceStore.defaultDiceSettings[setting];
};
</script>
