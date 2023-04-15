<template>
  <BaseCopyButton :text="command" :title="command" class="wide">{{
    text
  }}</BaseCopyButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseCopyButton from "../Base/BaseCopyButton.vue";

const props = withDefaults(defineProps<{ dice: string; text?: string }>(), {
  text: "Roll command",
});

const command = computed(() => `/roll ${props.dice}`);
</script>
