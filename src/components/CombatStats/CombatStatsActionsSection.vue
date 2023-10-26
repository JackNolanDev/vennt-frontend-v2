<template>
  <HeroPointButton
    reason="Spent 1 Hero Point for 1 Action"
    :additional-adjust="{ actions: 1 }"
    class="wide"
    >Spend Hero Point for 1 Action</HeroPointButton
  >
</template>

<script setup lang="ts">
import HeroPointButton from "../Attributes/HeroPointButton.vue";
</script>
