<template>
  <div class="wide">
    <DiceCopyButton
      v-if="dice.discord === dice.roll20"
      :dice="dice.discord"
      :text="text"
    ></DiceCopyButton>
    <div v-else class="alignRow gap">
      <DiceCopyButton :dice="dice.discord" text="Discord"></DiceCopyButton>
      <DiceCopyButton
        :dice="dice.roll20"
        text="Roll20"
        :command-prefix="true"
      ></DiceCopyButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiceCommands } from "@/utils/backendTypes";
import DiceCopyButton from "./DiceCopyButton.vue";

defineProps<{ dice: DiceCommands; text?: string }>();
</script>
