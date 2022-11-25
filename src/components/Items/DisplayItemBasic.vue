<template>
  <h2 class="mt-0 mb-0">{{ itemName }}</h2>
  <p v-if="item.custom_fields && item.custom_fields.special" class="mt-16 mb-0">
    <i>{{ item.custom_fields.special }}</i>
  </p>
  <p class="mt-16 mb-0">
    <b>Description:</b> <DisplayItemDesc :item="item"></DisplayItemDesc>
  </p>
  <p class="mt-16 mb-0">
    <b>{{ bulkLabel }}:</b> <span class="number">{{ item.bulk }}</span>
  </p>
  <p v-if="item.ids.length > 1" class="mt-16 mb-0">
    <b>Count:</b> <span class="number">{{ item.ids.length }}</span>
  </p>
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "@/utils/backendTypes";
import { prefixName } from "@/utils/textUtils";
import { computed } from "vue";
import DisplayItemDesc from "./DisplayItemDesc.vue";

const props = defineProps<{ item: ConsolidatedItem }>();
const itemName = computed(() => prefixName(props.item.name));
const bulkLabel = computed(() =>
  props.item.type === "container" ? "Carrying Capacity" : "Bulk"
);
</script>
