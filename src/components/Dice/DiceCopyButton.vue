<template>
  <BaseCopyButton :text="command" :title="command" class="wide">{{
    text
  }}</BaseCopyButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseCopyButton from "../Base/BaseCopyButton.vue";

const props = withDefaults(
  defineProps<{ dice: string; text?: string; commandPrefix?: boolean }>(),
  {
    text: "Roll command",
  }
);

const command = computed(
  () => `${props.commandPrefix ? "/roll" : ""} ${props.dice}`
);
</script>
