<template>
  <p>In this step, you select your base attributes.</p>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">
      1. Select three attributes you used most as a child.
    </p>
    <ConnectedAttributeSelection
      attrKey="childAttrs"
    ></ConnectedAttributeSelection>
  </div>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0">
      2. Select three attributes you used most in the last six years.
    </p>
    <ConnectedAttributeSelection
      attrKey="adultAttrs"
    ></ConnectedAttributeSelection>
  </div>
  <div
    class="card column padded mb-24"
    v-if="characterCreateStore.options.gift === 'None'"
  >
    <p class="textBlock mt-0">
      3. Add 1 to any three Attributes if you have No Gift.
    </p>
    <ConnectedAttributeSelection
      attrKey="noGiftAttrs"
    ></ConnectedAttributeSelection>
  </div>
  <div class="card column padded mb-24">
    <p class="textBlock mt-0 mb-0">
      4. Subtract 1 from three Attributes. You may pick any Attribute, but if
      your character is...
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
      attrKey="badAttrs"
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
    <ConnectedAttributeSelection attrKey="grate1"></ConnectedAttributeSelection>
    <div class="separator mt-16 mb-16"></div>
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
    <ConnectedAttributeSelection attrKey="grate3"></ConnectedAttributeSelection>
  </div>
</template>

<script setup lang="ts">
import { useCharacterCreateStore } from "@/stores/characterCreate";
import ConnectedAttributeSelection from "./ConnectedAttributeSelection.vue";

const characterCreateStore = useCharacterCreateStore();
</script>
