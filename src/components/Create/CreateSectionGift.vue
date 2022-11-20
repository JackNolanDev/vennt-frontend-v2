<template>
  <p class="textBlock">
    <i>
      Most legends are born gifted in some way. Mozart was gifted in music,
      Achilles was gifted in combat, and Merlin was gifted in magic. There are
      nine gifts available to choose from as a hero of Amnis, each one providing
      unique boons to your character.
    </i>
  </p>
  <GiftSelection
    :gift="characterCreateStore.options.gift"
    @gift-selected="chooseGift"
  ></GiftSelection>
</template>

<script setup lang="ts">
import { useCharacterCreateStore } from "@/stores/characterCreate";
import type { CharacterGift } from "@/utils/backendTypes";
import GiftSelection from "./GiftSelection.vue";

const characterCreateStore = useCharacterCreateStore();

const chooseGift = (gift: CharacterGift) => {
  characterCreateStore.options.gift = gift;
  characterCreateStore.saveToLocalStorage();
};
</script>
