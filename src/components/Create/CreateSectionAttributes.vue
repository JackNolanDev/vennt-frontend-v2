<template>
  <p>In this step, you select your base attributes.</p>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">
      1. Select three attributes you used most as a child.
    </p>
    <ConnectedAttributeSelection
      :details="CHILD_ATTRS_OPTIONS"
    ></ConnectedAttributeSelection>
  </div>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">
      2. Select three attributes you used most in the last six years.
    </p>
    <ConnectedAttributeSelection
      :details="ADULT_ATTRS_OPTIONS"
    ></ConnectedAttributeSelection>
  </div>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">3. Choose one:</p>
    <ConnectedRadioButtons
      :details="ADDITIONAL_ATTRS_CHOICE_OPTIONS"
    ></ConnectedRadioButtons>
    <ConnectedAttributeSelection
      :details="ADDITIONAL_ATTRS_OPTIONS"
    ></ConnectedAttributeSelection>
  </div>
</template>

<script setup lang="ts">
import ConnectedAttributeSelection from "./ConnectedAttributeSelection.vue";
import {
  CHILD_ATTRS_OPTIONS,
  ADULT_ATTRS_OPTIONS,
  ADDITIONAL_ATTRS_CHOICE_OPTIONS,
  ADDITIONAL_ATTRS_OPTIONS,
} from "@/utils/copy/createCharacterCopy";
import ConnectedRadioButtons from "./ConnectedRadioButtons.vue";
</script>
