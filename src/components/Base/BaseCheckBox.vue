<template>
  <BaseButton :icon="props.checked ? 'check_box' : 'check_box_outline_blank'">
    <slot></slot>
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

const props = defineProps<{ checked: boolean }>();
</script>
