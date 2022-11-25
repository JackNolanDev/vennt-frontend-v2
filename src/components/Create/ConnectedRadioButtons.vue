<template>
  <BaseRadioButtons
    :options="RADIO_OPTIONS[radioKey].options"
    :selected="characterCreateStore.options.radioSelections[radioKey]"
    @selected-updated="selectedUpdated"
  ></BaseRadioButtons>
</template>
<script setup lang="ts">
import { useCharacterCreateStore } from "@/stores/characterCreate";
import {
  type RadioSelections,
  RADIO_OPTIONS,
} from "@/utils/copy/createCharacterCopy";
import BaseRadioButtons from "../Base/BaseRadioButtons.vue";

const props = defineProps<{ radioKey: keyof RadioSelections }>();
const characterCreateStore = useCharacterCreateStore();

const selectedUpdated = (key: string) => {
  characterCreateStore.options.radioSelections[props.radioKey] = key;
  if (RADIO_OPTIONS[props.radioKey].clearAdditionalAttrs) {
    // tbh kinda hacky, but whatever
    characterCreateStore.options.attributeSelections.additionalAttrs = [];
  }
  characterCreateStore.saveToLocalStorage();
};
</script>
