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
import {
  ATTR_FILTERS_ON_GIFT_SELECTION,
  giftMatchesAttr,
} from "@/utils/copy/createCharacterCopy";
import GiftSelection from "./GiftSelection.vue";

const characterCreateStore = useCharacterCreateStore();

const chooseGift = (gift: CharacterGift) => {
  characterCreateStore.options.gift = gift;
  ATTR_FILTERS_ON_GIFT_SELECTION.forEach((attrSelection) => {
    characterCreateStore.options.attributeSelections[attrSelection] =
      characterCreateStore.options.attributeSelections[attrSelection].filter(
        (attr) => !giftMatchesAttr(gift, attr)
      );
  });
  characterCreateStore.saveToLocalStorage();
};
</script>
