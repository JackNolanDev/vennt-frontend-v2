<template>
  <p class="textBlock">
    Set 1-3
    <a href="https://vennt.fandom.com/wiki/Quests" target="_blank">Quests</a>
    for your character.
  </p>
  <div
    v-for="(_, idx) in characterCreateStore.options.quests"
    :key="idx"
    class="mb-16"
  >
    <label class="labelText mb-4">Quest {{ idx + 1 }}:</label>
    <BaseFullFeaturedTextEditor
      v-model="characterCreateStore.options.quests[idx]"
      :placeholder="placeholderQuests[idx]"
      @focusout="characterCreateStore.saveToLocalStorage()"
    ></BaseFullFeaturedTextEditor>
  </div>
</template>

<script setup lang="ts">
import { useCharacterCreateStore } from "@/stores/characterCreate";
import BaseFullFeaturedTextEditor from "../Base/BaseFullFeaturedTextEditor.vue";

const characterCreateStore = useCharacterCreateStore();

const placeholderQuests = [
  "Why was I born with this symbol on my hand?",
  "I want to avenge my brother.",
  "Escape to the surface.",
];
</script>
