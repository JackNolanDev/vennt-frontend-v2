<template>
  <p class="mt-16 mb-0">
    <b>{{ bulkLabel }}:</b>
    <span class="number ml-4">{{ item.bulk }}</span>
    <span
      v-if="itemEquippable(item) && item.type !== 'container'"
      class="mutedText ml-4"
      >{{ item.active ? "(Equipped)" : "(Unequipped)" }}</span
    >
  </p>
</template>

<script setup lang="ts">
import type { EntityItem } from "vennt-library";
import { itemEquippable } from "@/utils/itemUtils";
import { computed } from "vue";

const props = defineProps<{ item: EntityItem }>();
const bulkLabel = computed(() =>
  props.item.type === "container" ? "Carrying Capacity" : "Bulk"
);
</script>
