<template>
  <p>In this step, you select your base attributes.</p>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">
      1. Select three attributes you used most as a child.
    </p>
    <ConnectedAttributeSelection
      attrSel="childAttrs"
    ></ConnectedAttributeSelection>
  </div>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">
      2. Select three attributes you used most in the last six years.
    </p>
    <ConnectedAttributeSelection
      attrSel="adultAttrs"
    ></ConnectedAttributeSelection>
  </div>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">3. Choose one:</p>
    <ConnectedRadioButtons
      :details="ADDITIONAL_ATTRS_CHOICE_OPTIONS"
    ></ConnectedRadioButtons>
    <div class="seperator mt-16 mb-16"></div>
    <ConnectedAttributeSelection
      attrSel="additionalAttrs"
    ></ConnectedAttributeSelection>
  </div>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0 mb-0">
      4. Subtract 1 from one Attribute that is currently at 0, if one exists.
      You may pick any Attribute from amongst those at 0, but if your character
      is...
    </p>
    <ul>
      <li>Inattentive... ...You might want to pick PER.</li>
      <li>A luddite... ...You might want to pick TEK.</li>
      <li>Clumsy... ...You might want to pick DEX.</li>
      <li>Ignorant... ...You might want to pick INT.</li>
      <li>Impatient... ...You might want to pick WIS.</li>
      <li>Sluggish... ...You might want to pick AGI.</li>
      <li>Apathetic... ...You might want to pick SPI.</li>
      <li>Weak... ...You might want to pick STR.</li>
      <li>Repulsive... ...You might want to pick CHA.</li>
    </ul>
    <ConnectedAttributeSelection
      attrSel="badAttrs"
    ></ConnectedAttributeSelection>
  </div>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">
      5. Select an attribute that corresponds to your first grate. This will
      subtract 1 from the selected attribute. (Optional, requires the
      <a
        href="https://vennt.fandom.com/wiki/Course_of_Flux"
        target="_blank"
        class="link"
        >Course of Flux</a
      >)
    </p>
    <ConnectedAttributeSelection attrSel="grate1"></ConnectedAttributeSelection>
    <div class="seperator mt-16 mb-16"></div>
    <p class="textBlock mt-0">
      Select an attribute that corresponds to your third grate. This will add 1
      to the selected attribute. (Optional, requires the
      <a
        href="https://vennt.fandom.com/wiki/Course_of_Flux"
        target="_blank"
        class="link"
        >Course of Flux</a
      >)
    </p>
    <ConnectedAttributeSelection attrSel="grate3"></ConnectedAttributeSelection>
  </div>
</template>

<script setup lang="ts">
import ConnectedAttributeSelection from "./ConnectedAttributeSelection.vue";
import { ADDITIONAL_ATTRS_CHOICE_OPTIONS } from "@/utils/copy/createCharacterCopy";
import ConnectedRadioButtons from "./ConnectedRadioButtons.vue";
</script>
