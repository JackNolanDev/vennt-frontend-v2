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
        :id="`dice-settings-flow-${unique}`"
        class="input tiny ml-8"
      />
      <label :for="`dice-settings-flow-${unique}`" class="labelText"
        >Flow</label
      >
    </div>
    <div class="alignRow gap mb-2">
      <input
        type="number"
        inputmode="numeric"
        placeholder="0"
        min="0"
        v-model.number="diceStore.defaultDiceSettings.ebb"
        title="Amount of ebb to use in dice rolls"
        :id="`dice-settings-ebb-${unique}`"
        class="input tiny ml-8"
      />
      <label :for="`dice-settings-ebb-${unique}`" class="labelText">Ebb</label>
    </div>
    <BaseCheckBox
      :checked="!!diceStore.defaultDiceSettings.rr1s"
      :highlight="true"
      @click="toggleRr1s"
      class="wide"
      >Re-roll 1s</BaseCheckBox
    >
    <BaseCheckBox
      :checked="!!diceStore.defaultDiceSettings.heroic_creativity_bonus"
      :highlight="true"
      @click="toggleHeroicCreativityBonus"
      class="wide"
      >Heroic Creativity</BaseCheckBox
    >
  </div>
</template>
<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import BaseCheckBox from "../Base/BaseCheckBox.vue";
import { useEntityStore } from "@/stores/entity";

const diceStore = useDiceStore();
const entityStore = useEntityStore();

// Use this to ensure ids are always unique
const unique = Math.random().toString().substring(2);

const toggleRr1s = () => {
  diceStore.defaultDiceSettings.rr1s = !diceStore.defaultDiceSettings.rr1s;
};
const toggleHeroicCreativityBonus = () => {
  if (diceStore.defaultDiceSettings.heroic_creativity_bonus) {
    diceStore.defaultDiceSettings.heroic_creativity_bonus = 0;
  } else {
    diceStore.defaultDiceSettings.heroic_creativity_bonus =
      entityStore.entityAttributes.heroic_creativity_bonus?.val ?? 3;
  }
};
</script>
