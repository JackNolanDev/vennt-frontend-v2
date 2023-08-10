<template>
  <div class="alignRow gap wide mb-16 time-buttons">
    <BaseButton @click="handleEndTimePeriod('turn')" class="wide"
      >End turn</BaseButton
    >
    <BaseButton @click="handleEndTimePeriod('encounter')" class="wide"
      >End Combat /&nbsp;Scene</BaseButton
    >
    <BaseButton @click="handleEndTimePeriod('rest')" class="wide"
      >Rest</BaseButton
    >
  </div>
</template>

<script setup lang="ts">
import BaseButton from "../Base/BaseButton.vue";
import { handleEndTimePeriod } from "@/utils/combatUtils";
</script>

<style scoped>
@container page (max-width: 600px) {
  .time-buttons {
    flex-direction: column;
  }
}
</style>
