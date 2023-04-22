<template>
  <div class="wide">
    <div v-if="showTitle">
      <h3 class="centeredText">{{ giftCopyV14[gift].title }}</h3>
      <div class="separator thin"></div>
    </div>
    <div class="textMargin">
      <p class="mt-0 mb-0">{{ giftCopyV14[gift].desc }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CharacterGift } from "@/utils/backendTypes";
import { giftCopyV14 } from "@/utils/copy/giftCopy";

defineProps<{ showTitle?: boolean; gift: CharacterGift }>();
</script>

<style scoped>
.textMargin {
  margin: 16px;
  text-align: left;
  user-select: text; /* Allows users to highlight text for easier reading */
}
</style>
