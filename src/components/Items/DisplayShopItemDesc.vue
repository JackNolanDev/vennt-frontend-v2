<template>
  <div v-html="itemHTML"></div>
</template>

<script setup lang="ts">
import type { ShopItem } from "@/utils/backendTypes";
import { renderMarkdown } from "@/utils/textUtils";
import { computed } from "vue";

const props = defineProps<{ item: ShopItem }>();
const itemHTML = computed(() => {
  const desc =
    props.item.category === "Grenade" && props.item.special
      ? props.item.special
      : props.item.desc;
  return renderMarkdown(desc);
});
</script>
