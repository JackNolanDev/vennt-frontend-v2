<template>
  <div v-html="itemHTML"></div>
</template>

<script setup lang="ts">
import type { EntityItem } from "vennt-library";
import { renderMarkdown } from "@/utils/textUtils";
import { computed } from "vue";

const props = defineProps<{ item: EntityItem }>();
const itemHTML = computed(() => {
  const desc =
    props.item.custom_fields?.category === "Grenade" &&
    props.item.custom_fields.special
      ? props.item.custom_fields.special
      : props.item.desc;
  return renderMarkdown(desc);
});
</script>
