<template>
  <BaseButton
    @click="useItem"
    title="Activates the item's use"
    class="primary wide mb-8"
    >Consume Item</BaseButton
  >
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "@/utils/backendTypes";
import BaseButton from "../Base/BaseButton.vue";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ item: ConsolidatedItem }>();
const entityStore = useEntityStore();

const useItem = () => {
  entityStore.updateItem(props.item.id, { active: true });
};
</script>
