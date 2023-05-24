<template>
  <p class="textBlock">
    This section helps you figure out what equipment you have on you.
  </p>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0 mb-0">1. Describe your outfit.</p>
    <p class="textBlock">
      Every character begins with a Functional Outfit, an Item Container with a
      carrying capacity of 15 Bulk, but this can look like anything you want
    </p>
  </div>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">2. What did you bring with you?</p>
    <ConnectedRadioButtons radio-key="itemSet"></ConnectedRadioButtons>
  </div>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">3. What do you keep at your side?</p>
    <ConnectedRadioButtons radio-key="sideItem"></ConnectedRadioButtons>
  </div>
  <div class="card column padded">
    <p class="textBlock mt-0">
      4. What's your
      <a href="https://vennt.fandom.com/wiki/Guild_Rank" target="_blank"
        >Guild Rank?</a
      >
    </p>
    <ConnectedRadioButtons radio-key="guildRank"></ConnectedRadioButtons>
  </div>
</template>

<script setup lang="ts">
import ConnectedRadioButtons from "./ConnectedRadioButtons.vue";
</script>
