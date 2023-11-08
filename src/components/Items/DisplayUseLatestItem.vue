<template>
  <BaseButton
    v-if="itemNewVersion"
    @click="updateItems"
    icon="refresh"
    title="Updates this item to use the latest version in the shop"
    class="wide mt-8"
    >Use latest version</BaseButton
  >
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import type { ConsolidatedItem } from "vennt-library";
import { findNewItemVersion } from "@/utils/itemUtils";
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{ item: ConsolidatedItem }>();
const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

const itemNewVersion = computed(() =>
  findNewItemVersion(props.item, jsonStorage.shopItems),
);

const updateItems = () => {
  const itemIds = props.item.ids;
  itemIds.forEach((itemId) => {
    if (entityStore.entity && itemNewVersion.value) {
      entityStore.updateItem(itemId, itemNewVersion.value);
    }
  });
};
</script>
