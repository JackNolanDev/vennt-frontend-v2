<template>
  <BaseButton :icon="icon" :class="{ selected: highlight && checked }">
    <slot></slot>
  </BaseButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps<{
  checked: boolean;
  highlight?: boolean;
  useToggle?: boolean;
}>();
const icon = computed(() => {
  if (props.useToggle) {
    return props.checked ? "toggle_on" : "toggle_off";
  }
  return props.checked ? "check_box" : "check_box_outline_blank";
});
</script>
