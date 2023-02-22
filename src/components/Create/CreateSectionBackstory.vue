<template>
  <p class="textBlock">
    Follow
    <a
      href="https://vennt.fandom.com/wiki/Character_Concept_Help"
      target="_blank"
      >this wiki page</a
    >
    for help with coming up a character concept and
    <a href="https://vennt.fandom.com/wiki/Backstory" target="_blank">
      this wiki page</a
    >
    for more information for describing your backstory.
  </p>
  <div class="cols-2 gap-16 editors">
    <div>
      <label class="labelText mb-4">Character Description</label>
      <BaseFullFeaturedTextEditor
        v-model="characterCreateStore.options.desc"
        placeholder="Describe your character here"
        @focusout="characterCreateStore.saveToLocalStorage()"
      ></BaseFullFeaturedTextEditor>
    </div>
    <div>
      <label class="labelText mb-4">Character Backstory</label>
      <BaseFullFeaturedTextEditor
        v-model="characterCreateStore.options.backstory"
        placeholder="Super secret character backstory"
        @focusout="characterCreateStore.saveToLocalStorage()"
      ></BaseFullFeaturedTextEditor>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharacterCreateStore } from "@/stores/characterCreate";
import BaseFullFeaturedTextEditor from "../Base/BaseFullFeaturedTextEditor.vue";

const characterCreateStore = useCharacterCreateStore();
</script>

<style scoped>
@container page (max-width: 800px) {
  .editors {
    grid-template-columns: 1fr;
  }
}
</style>
