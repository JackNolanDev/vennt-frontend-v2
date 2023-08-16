<template>
  <BaseButton
    @click="copyText"
    :icon="link ? 'link' : 'content_copy'"
    clicked-note="Copied!"
    ><slot></slot
  ></BaseButton>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

const props = defineProps<{ text: string; link?: boolean }>();

const copyText = () => {
  navigator.clipboard.writeText(props.text);
};
</script>

<style scoped>
.copy-button {
  position: relative;
}
.copied-label {
  position: absolute;
  bottom: 100%;
  padding: 8px;
  background: var(--background-high-contrast);
  border-radius: var(--border-radius);
}
</style>
