<template>
  <pre><code><BaseCopyButton :text="text" title="Copy this text" class="copy-button"></BaseCopyButton>{{ text }}</code></pre>
</template>

<script setup lang="ts">
import BaseCopyButton from "./BaseCopyButton.vue";

defineProps<{ text: string }>();
</script>

<style scoped>
.copy-button {
  position: absolute;
  right: 0;
}
</style>
