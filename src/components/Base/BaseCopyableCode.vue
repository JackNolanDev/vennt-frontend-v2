<template>
  <pre><code><BaseButton @click="copyText" icon="content_copy" title="Copy this text" class="copy-button"></BaseButton>{{ text }}</code></pre>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

const props = defineProps<{ text: string }>();

const copyText = () => {
  navigator.clipboard.writeText(props.text);
};
</script>

<style scoped>
.copy-button {
  position: absolute;
  right: 0;
}
</style>
