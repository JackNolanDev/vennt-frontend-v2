<template>
  <StartTurnButton class="mt-8"></StartTurnButton>
  <HeroPointButton
    reason="Spent 1 Hero Point for 2 Reactions"
    :additional-adjust="{ reactions: 2 }"
    class="wide"
    >Spent Hero Point for 2 Reactions</HeroPointButton
  >
</template>

<script setup lang="ts">
import StartTurnButton from "@/components/Combat/StartTurnButton.vue";
import HeroPointButton from "../../Attributes/HeroPointButton.vue";
</script>
