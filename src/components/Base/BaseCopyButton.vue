<template>
  <BaseButton @click="copyText" icon="content_copy"><slot></slot></BaseButton>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

const props = defineProps<{ text: string }>();

const copyText = () => {
  navigator.clipboard.writeText(props.text);
};
</script>
