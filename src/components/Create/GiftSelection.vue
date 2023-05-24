<template>
  <div>
    <BaseButton
      @click="toggleDropDown"
      :disabled="gift === undefined"
      :icon="state.closed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
      class="secondary wide left"
    >
      <span v-if="state.closed">Show All Gifts</span>
      <span v-else>Hide Unselected Gifts</span>
    </BaseButton>
    <div v-if="!state.closed || gift === undefined" class="giftCardGroup">
      <button
        v-for="giftItem in CHARACTER_GIFTS"
        v-bind:key="giftItem"
        @click="chooseGift(giftItem)"
        class="btn noSelect card selectable column giftCard"
        :class="{ selected: gift === giftItem }"
      >
        <GiftDescriptionV14 :gift="giftItem" :show-title="true" />
      </button>
    </div>
    <div v-else>
      <GiftDescriptionV14 :gift="gift" :show-title="true" class="card column" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CHARACTER_GIFTS, type CharacterGift } from "@/utils/backendTypes";
import { reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import GiftDescriptionV14 from "./GiftDescriptionV14.vue";

const state = reactive({ closed: false });
const props = defineProps<{ gift?: CharacterGift }>();
const emit = defineEmits<{ (e: "giftSelected", state: CharacterGift): void }>();

const toggleDropDown = () => {
  state.closed = !state.closed;
};

const chooseGift = (gift: CharacterGift) => {
  if (!props.gift) {
    toggleDropDown(); // close dropdown on first selection
  }
  emit("giftSelected", gift);
};
</script>

<style scoped>
.giftCardGroup {
  display: grid;
  grid-template-columns: repeat(3, 1fr [col-start]);
  gap: 4px;
}

.giftCard {
  align-items: center;
  flex-grow: 1;
}

.singleCard {
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
}

@container page (max-width: 900px) {
  .giftCardGroup {
    grid-template-columns: repeat(2, 1fr [col-start]);
  }
}
@container page (max-width: 600px) {
  .giftCardGroup {
    grid-template-columns: repeat(1, 1fr [col-start]);
  }
}
</style>
