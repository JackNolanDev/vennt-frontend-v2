<template>
  <p class="textBlock">
    This section helps you figure out what equipment you have on you.
  </p>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">1. What do you keep at your side?</p>
    <ConnectedRadioButtons radio-key="sideItem"></ConnectedRadioButtons>
    <div v-if="showRememberOptions">
      <p>Select "Something to Remember" benefit:</p>
      <ConnectedRadioButtons radio-key="rememberItem"></ConnectedRadioButtons>
    </div>
  </div>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0 mb-0">2. Describe your outfit.</p>
    <p class="textBlock">
      This is your starting Item Container. If you buy another item container,
      it replaces this one.
    </p>
    <ConnectedRadioButtons radio-key="outfit"></ConnectedRadioButtons>
  </div>
  <div class="card column padded">
    <p class="textBlock mt-0">3. What did you bring with you?</p>
    <ConnectedRadioButtons radio-key="itemSet"></ConnectedRadioButtons>
  </div>
</template>

<script setup lang="ts">
import { useCharacterCreateStore } from "@/stores/characterCreate";
import { computed } from "vue";
import ConnectedRadioButtons from "./ConnectedRadioButtons.vue";

const characterCreateStore = useCharacterCreateStore();
const showRememberOptions = computed(
  () => characterCreateStore.options.radioSelections.sideItem === "remember"
);
</script>
