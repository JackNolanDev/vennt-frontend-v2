<template>
  <div class="wide">
    <DiceCopyButton
      v-if="dice.discord === dice.roll20"
      :dice="dice.discord"
    ></DiceCopyButton>
    <div v-else class="alignRow gap">
      <DiceCopyButton :dice="dice.discord" text="Discord"></DiceCopyButton>
      <DiceCopyButton :dice="dice.roll20" text="Roll20"></DiceCopyButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiceCommands } from "@/utils/backendTypes";
import DiceCopyButton from "./DiceCopyButton.vue";

defineProps<{ dice: DiceCommands }>();
</script>
