<template>
  <HeroPointButton
    reason="Spent 1 Hero Point for 25 XP"
    :additional-adjust="{ xp: 25 }"
    class="wide"
    >Spent Hero Point for 25 XP</HeroPointButton
  >
</template>

<script setup lang="ts">
import HeroPointButton from "../Attributes/HeroPointButton.vue";
</script>
