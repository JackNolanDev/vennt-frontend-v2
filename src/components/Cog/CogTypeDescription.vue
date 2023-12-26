<template>
  <div v-html="desc" class="m-8 condense-child-text"></div>
</template>

<script setup lang="ts">
import { cogTypeOptions } from "@/utils/copy/createCogTypeOptions";
import { renderMarkdown } from "@/utils/textUtils";
import { computed } from "vue";

const props = defineProps<{ cog_type?: string }>();

const desc = computed(() =>
  renderMarkdown(cogTypeOptions[props.cog_type ?? ""] ?? ""),
);
</script>
