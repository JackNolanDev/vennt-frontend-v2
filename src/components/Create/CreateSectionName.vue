<template>
  <label for="new-name">
    <p class="textBlock">
      Choose a name for your character. You can always come back to this step
      later. Or, press the button to generate a random name for now.
    </p>
  </label>
  <div class="alignRow gap mt-4 nameRow">
    <input
      type="text"
      name="charName"
      placeholder="Bilbo Baggins"
      v-model="characterCreateStore.name"
      class="input nameInput"
      id="new-name"
    />
    <BaseButton
      @click="randomNameButton"
      :disabled="!randomNamesStore.randomNamesEnabled"
      icon="refresh"
      class="primary"
      >Random name</BaseButton
    >
  </div>
</template>

<script setup lang="ts">
import { useCharacterCreateStore } from "@/stores/characterCreate";
import { useRandomNameStore } from "@/stores/randomName";
import BaseButton from "../Base/BaseButton.vue";

const characterCreateStore = useCharacterCreateStore();
const randomNamesStore = useRandomNameStore();

const randomNameButton = () => {
  if (randomNamesStore.randomNames.length < 3) {
    randomNamesStore.fetchRandomNames();
  }
  if (randomNamesStore.randomNames.length > 0) {
    characterCreateStore.name = randomNamesStore.randomNames[0];
    randomNamesStore.shiftNames();
  }
};

randomNamesStore.fetchRandomNames();
</script>
