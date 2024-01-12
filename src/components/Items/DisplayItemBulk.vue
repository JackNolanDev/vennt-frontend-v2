<template>
  <p class="mt-16 mb-0">
    <b>Bulk:</b>
    <span class="number ml-4">{{ item.bulk }}</span>
    <span v-if="itemEquippable(item)" class="mutedText ml-4">{{
      item.active ? "(Equipped)" : "(Unequipped)"
    }}</span>
  </p>
</template>

<script setup lang="ts">
import type { EntityItem } from "vennt-library";
import { itemEquippable } from "@/utils/itemUtils";

defineProps<{ item: EntityItem }>();
</script>
