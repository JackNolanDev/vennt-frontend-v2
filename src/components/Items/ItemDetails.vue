<template>
  <DisplayItemFull :item="item"></DisplayItemFull>
  <ItemUses :item="item"></ItemUses>
  {{ item }}
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "@/utils/backendTypes";
import DisplayItemFull from "./DisplayItemFull.vue";
import ItemUses from "../Uses/ItemUses.vue";

defineProps<{ item: ConsolidatedItem }>();
</script>
