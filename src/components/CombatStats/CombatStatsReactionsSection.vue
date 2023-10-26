<template>
  <HeroPointButton
    reason="Spent 1 Hero Point for 2 Reactions"
    :additional-adjust="{ reactions: 2 }"
    class="wide"
    >Spent Hero Point for 2 Reactions</HeroPointButton
  >
</template>

<script setup lang="ts">
import HeroPointButton from "../Attributes/HeroPointButton.vue";
</script>
