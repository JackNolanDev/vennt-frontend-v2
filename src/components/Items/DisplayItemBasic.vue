<template>
  <DisplayItemName :item="item"></DisplayItemName>
  <p v-if="item.custom_fields?.special" class="mt-16 mb-0">
    <i>{{ item.custom_fields.special }}</i>
  </p>
  <p class="mt-16 mb-0">
    <b>Description:</b> <ItemDesc :item="item"></ItemDesc>
  </p>
  <DisplayItemBulk :item="item"></DisplayItemBulk>
  <p v-if="item.ids.length > 1" class="mt-16 mb-0">
    <b>Count:</b> <span class="number">{{ item.ids.length }}</span>
  </p>
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "@/utils/backendTypes";
import ItemDesc from "./ItemDesc.vue";
import DisplayItemName from "./DisplayItemName.vue";
import DisplayItemBulk from "./DisplayItemBulk.vue";

defineProps<{ item: ConsolidatedItem }>();
</script>
