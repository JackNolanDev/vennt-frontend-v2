<template>
  <div class="card column padded">
    <p class="textBlock mt-0">Are you new to adventuring?</p>
    <ConnectedRadioButtons radio-key="experience"></ConnectedRadioButtons>
  </div>
  <p class="textBlock">
    For now, you need to go to the Character page to select abilities and buy /
    sell items.
  </p>
</template>

<script setup lang="ts">
import ConnectedRadioButtons from "./ConnectedRadioButtons.vue";
</script>
