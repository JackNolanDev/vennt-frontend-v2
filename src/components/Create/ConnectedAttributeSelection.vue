<template>
  <AttributeSelection
    :selected="characterCreateStore.options.attributeSelections[attrKey]"
    :maxChoices="maxChoices"
    :disabledChoices="disabledChoices"
    @selected-updated="selectedUpdated"
  ></AttributeSelection>
</template>

<script setup lang="ts">
import { useCharacterCreateStore } from "@/stores/characterCreate";
import type { BaseEntityAttribute } from "vennt-library";
import {
  ATTR_OPTIONS,
  type AttributeSelections,
} from "@/utils/copy/createCharacterCopy";
import { computed } from "vue";
import AttributeSelection from "../Attributes/AttributeSelection.vue";

const props = defineProps<{ attrKey: keyof AttributeSelections }>();
const characterCreateStore = useCharacterCreateStore();

const maxChoices = computed(() => {
  const max = ATTR_OPTIONS[props.attrKey].max;
  return typeof max === "number" ? max : max(characterCreateStore.options);
});

const disabledChoices = computed(() => {
  const disabledGenerator = ATTR_OPTIONS[props.attrKey].disabledGenerator;
  return disabledGenerator === undefined
    ? []
    : disabledGenerator(characterCreateStore.options);
});

const selectedUpdated = (list: BaseEntityAttribute[]) => {
  characterCreateStore.options.attributeSelections[props.attrKey] = list;
  const filterLists = ATTR_OPTIONS[props.attrKey].filterLists;
  if (filterLists) {
    filterLists.forEach((filterKey) => {
      characterCreateStore.options.attributeSelections[filterKey] =
        characterCreateStore.options.attributeSelections[filterKey].filter(
          (attr) => !list.includes(attr),
        );
    });
  }
  characterCreateStore.saveToLocalStorage();
};
</script>
