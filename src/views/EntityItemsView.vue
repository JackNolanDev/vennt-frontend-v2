<template>
  <h1>Inventory</h1>
  <div class="alignRow labelText mb-16">
    Used Carrying Capacity:
    <BaseFraction
      :top="bulkSum"
      :bottom="bulkCapacity"
      class="ml-16"
    ></BaseFraction>
  </div>
  <ItemTable :items="entityStore.consolidatedItems" class="mb-128"></ItemTable>
</template>

<script setup lang="ts">
import BaseFraction from "@/components/Base/BaseFraction.vue";
import ItemTable from "@/components/Items/ItemTable.vue";
import { useEntityStore } from "@/stores/entity";
import { computed } from "vue";

const entityStore = useEntityStore();

const bulkCapacity = computed(() => {
  if (!entityStore.entity) {
    return 0;
  }
  return entityStore.entity.items
    .filter((item) => item.type === "container")
    .reduce((sum, item) => sum + item.bulk, 0);
});

const bulkSum = computed(() => {
  if (!entityStore.entity) {
    return 0;
  }
  return entityStore.entity.items
    .filter((item) => item.type !== "container" && !item.active)
    .reduce((sum, item) => sum + item.bulk, 0);
});
</script>
