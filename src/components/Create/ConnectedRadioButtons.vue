<template>
  <BaseRadioButtons
    :options="details.options"
    :selected="characterCreateStore.options.radioSelections[details.key]"
    @selected-updated="selectedUpdated"
  ></BaseRadioButtons>
</template>
<script setup lang="ts">
import { useCharacterCreateStore } from "@/stores/characterCreate";
import type { RadioButtonOptionsDetails } from "@/utils/copy/createCharacterCopy";
import BaseRadioButtons from "../Base/BaseRadioButtons.vue";

const props = defineProps<{ details: RadioButtonOptionsDetails }>();
const characterCreateStore = useCharacterCreateStore();

const selectedUpdated = (key: string) => {
  characterCreateStore.options.radioSelections[props.details.key] = key;
  if (props.details.clearAdditionalAttrs) {
    // tbh kinda hacky, but whatever
    characterCreateStore.options.attributeSelections.additionalAttrs = [];
  }
};
</script>
