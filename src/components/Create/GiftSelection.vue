<template>
  <BaseDropDown
    :given-closed="state.closed"
    :disabled="characterCreateStore.gift === undefined"
    @change="updateState"
  >
    <template #closedTitle>Show All Gifts</template>
    <template #openTitle>Hide Unselected Gifts</template>
    <div class="giftCardGroup">
      <button
        v-for="gift in CHARACTER_GIFTS"
        v-bind:key="gift"
        class="btn noSelect card selectable giftCard"
        :class="characterCreateStore.gift === gift ? 'selected' : ''"
      >
        <GiftDescription :gift="gift" />
      </button>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import { useCharacterCreateStore } from "@/stores/characterCreate";
import { CHARACTER_GIFTS } from "@/utils/backendTypes";
import { reactive } from "vue";
import BaseDropDown from "../Base/BaseDropDown.vue";
import GiftDescription from "./GiftDescription.vue";

const state = reactive({ closed: false });
const characterCreateStore = useCharacterCreateStore();

const updateState = () => {
  state.closed = !state.closed;
};
</script>
