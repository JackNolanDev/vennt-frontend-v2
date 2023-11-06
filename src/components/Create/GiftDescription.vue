<template>
  <div class="wide">
    <div v-if="showTitle">
      <h3 class="centeredText">{{ giftCopy[gift].title }}</h3>
      <div class="separator thin"></div>
    </div>
    <div class="textMargin">
      <i>{{ giftCopy[gift].flavor }}</i>
      <ul>
        <li
          v-for="benefit in giftCopy[gift].benefits"
          v-bind:key="benefit"
          v-html="benefit"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CharacterGift } from "vennt-library";
import { giftCopy } from "@/utils/copy/giftCopy";

defineProps<{ showTitle?: boolean; gift: CharacterGift }>();
</script>

<style scoped>
.textMargin {
  margin: 16px;
  text-align: left;
  user-select: text; /* Allows users to highlight text for easier reading */
}
</style>
