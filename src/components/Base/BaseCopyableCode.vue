<template>
  <pre><code><BaseCopyButton :text="text" title="Copy this text" class="copy-button"></BaseCopyButton>{{ text }}</code></pre>
</template>

<script setup lang="ts">
import BaseCopyButton from "./BaseCopyButton.vue";

defineProps<{ text: string }>();
</script>

<style scoped>
code {
  position: relative;
}
.copy-button {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
