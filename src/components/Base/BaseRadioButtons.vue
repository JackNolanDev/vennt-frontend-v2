<template>
  <BaseButton
    v-for="(html, key) in options"
    :key="key"
    :icon="isSelected(key) ? 'radio_button_checked' : 'radio_button_unchecked'"
    @click="selectionButton(key)"
    :disabled="optionDisabled(key)"
    class="skinny wide"
  >
    <div
      v-html="renderMarkdown(html, attrs)"
      class="pt-12 wrap condense-child-text"
    ></div>
  </BaseButton>
</template>

<script setup lang="ts">
import type { HTMLString, UpdatedEntityAttributes } from "vennt-library";
import { renderMarkdown } from "@/utils/textUtils";
import BaseButton from "./BaseButton.vue";

const props = defineProps<{
  options: Record<string, HTMLString>;
  selected: string;
  unselectable?: boolean;
  attrs?: UpdatedEntityAttributes;
  disabledOptions?: string[];
}>();
const emit = defineEmits<{
  (e: "selectedUpdated", state: string): void;
}>();

const isSelected = (key: string) => {
  return key === props.selected;
};
const selectionButton = (key: string) => {
  if (!isSelected(key) && typeof key === "string") {
    emit("selectedUpdated", key);
  } else if (props.unselectable) {
    emit("selectedUpdated", ""); // unselect
  }
};
const optionDisabled = (key: string) => {
  return !isSelected(key) && props.disabledOptions?.includes(key);
};
</script>
