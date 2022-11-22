<template>
  <div class="container">
    <BaseButton
      v-for="attr in ATTRIBUTES"
      :key="attr"
      @click="selectionButton(attr)"
      :disabled="buttonDisabled(attr)"
      class="skinny"
    >
      <span v-if="isSelected(attr)" class="material-icons space">
        radio_button_checked
      </span>
      <span v-else class="material-icons space">radio_button_unchecked</span>
      <span
        >{{ attr.toUpperCase() }}
        <span v-if="attrs && attr in attrs"
          >(<span class="number">{{ attrs[attr] }}</span
          >)</span
        ></span
      >
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import {
  ATTRIBUTES,
  type BaseEntityAttribute,
  type UpdatedEntityAttributes,
} from "@/utils/backendTypes";
import BaseButton from "../Base/BaseButton.vue";

interface AttributeSelectionProps {
  selected: BaseEntityAttribute[];
  maxChoices: number;
  disabledChoices?: BaseEntityAttribute[];
  attrs?: UpdatedEntityAttributes;
}

const props = defineProps<AttributeSelectionProps>();
const emit = defineEmits<{
  (e: "selectedUpdated", state: BaseEntityAttribute[]): void;
}>();

const isSelected = (attr: BaseEntityAttribute) => {
  return props.selected.includes(attr);
};
const buttonDisabled = (attr: BaseEntityAttribute) => {
  if (isSelected(attr)) {
    return false;
  }
  if (props.disabledChoices && props.disabledChoices.includes(attr)) {
    return true;
  }
  return props.selected.length >= props.maxChoices;
};
const selectionButton = (attr: BaseEntityAttribute) => {
  let list = props.selected;
  if (isSelected(attr)) {
    list = list.filter((sel) => sel !== attr);
  } else {
    list.push(attr);
  }
  emit("selectedUpdated", list);
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr [col-start]);
}
</style>
