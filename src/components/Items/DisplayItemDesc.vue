<template>
  <span>{{ itemDesc }}</span>
</template>

<script setup lang="ts">
import type { EntityItem } from "@/utils/backendTypes";
import { improveTextForDisplay } from "@/utils/textUtils";
import { computed } from "vue";

const props = defineProps<{ item: EntityItem }>();
const itemDesc = computed(() => {
  const desc =
    props.item.custom_fields?.category === "Grenade" &&
    props.item.custom_fields.special
      ? props.item.custom_fields.special
      : props.item.desc;
  return improveTextForDisplay(desc);
});
</script>
