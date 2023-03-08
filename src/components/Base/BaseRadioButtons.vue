<template>
  <BaseButton
    v-for="(html, key) in options"
    :key="key"
    :icon="isSelected(key) ? 'radio_button_checked' : 'radio_button_unchecked'"
    @click="selectionButton(key)"
    class="skinny wide"
  >
    <span v-html="html" class="pt-12 wrap"></span>
  </BaseButton>
</template>

<script setup lang="ts">
import type { HTMLString } from "@/utils/backendTypes";
import BaseButton from "./BaseButton.vue";

const props = defineProps<{
  options: Record<string, HTMLString>;
  selected: string;
  unselectable?: boolean;
}>();
const emit = defineEmits<{
  (e: "selectedUpdated", state: string): void;
}>();

const isSelected = (key: string | number) => {
  return key === props.selected;
};
const selectionButton = (key: string | number) => {
  if (!isSelected(key) && typeof key === "string") {
    emit("selectedUpdated", key);
  } else if (props.unselectable) {
    emit("selectedUpdated", ""); // unselect
  }
};
</script>
