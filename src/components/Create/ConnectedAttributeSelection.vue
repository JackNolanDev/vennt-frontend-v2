<template>
  <AttributeSelection
    :selected="characterCreateStore.options.attributeSelections[details.key]"
    :maxChoices="maxChoices"
    :disabledChoices="disabledChoices"
    @selected-updated="selectedUpdated"
  ></AttributeSelection>
</template>

<script setup lang="ts">
import { useCharacterCreateStore } from "@/stores/characterCreate";
import type { BaseEntityAttribute } from "@/utils/backendTypes";
import type { AttributeSelectionOptionsDetails } from "@/utils/copy/createCharacterCopy";
import { computed } from "vue";
import AttributeSelection from "../Attributes/AttributeSelection.vue";

const props = defineProps<{ details: AttributeSelectionOptionsDetails }>();
const characterCreateStore = useCharacterCreateStore();

const maxChoices = computed(() => {
  if (typeof props.details.max === "number") {
    return props.details.max;
  }
  return props.details.max(characterCreateStore.options);
});

const disabledChoices = computed(() => {
  if (!props.details.disabledGenerator) {
    return [];
  }
  return props.details.disabledGenerator(characterCreateStore.options);
});

const selectedUpdated = (list: BaseEntityAttribute[]) => {
  characterCreateStore.options.attributeSelections[props.details.key] = list;
  if (props.details.filterLists) {
    props.details.filterLists.forEach((filterKey) => {
      characterCreateStore.options.attributeSelections[filterKey] =
        characterCreateStore.options.attributeSelections[filterKey].filter(
          (attr) => !list.includes(attr)
        );
    });
  }
  characterCreateStore.saveToLocalStorage();
};
</script>
