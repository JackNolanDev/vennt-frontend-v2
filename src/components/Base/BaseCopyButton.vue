<template>
  <BaseButton @click="copyText" :icon="link ? 'link' : 'content_copy'"
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
