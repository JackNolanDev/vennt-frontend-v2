<template>
  <BaseButton
    :icon="checked ? 'check_box' : 'check_box_outline_blank'"
    :class="{ selected: highlight && checked }"
  >
    <slot></slot>
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

defineProps<{ checked: boolean; highlight?: boolean }>();
</script>
