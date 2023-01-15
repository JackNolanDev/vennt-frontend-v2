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
  <div v-if="weapons.length > 0">
    <h2>Weapons</h2>
    <ItemTable :items="weapons" :hide-count="true" class="mb-24"></ItemTable>
  </div>
  <div v-if="otherItems.length > 0">
    <h2>General Items</h2>
    <ItemTable :items="otherItems" class="mb-24"></ItemTable>
  </div>
  <div v-if="showEditSection">
    <BaseButton
      v-if="entityStore.entity?.entity.id"
      :to="{
        name: ENTITY_ITEMS_ROUTE,
        params: router.currentRoute.value.params,
        query: { ...router.currentRoute.value.query, new: 'item' },
      }"
      icon="add"
      class="wide"
      >Add item</BaseButton
    >
    <h2>Buy Items</h2>
    <BaseButton
      v-if="entityStore.entity?.entity.id"
      :to="{
        name: ENTITY_ITEM_SHOP_ROUTE,
        params: { id: entityStore.entity.entity.id },
      }"
      icon="store"
      class="wide"
      >Item Shop</BaseButton
    >
    <BaseButton
      v-if="entityStore.entity?.entity.id"
      :to="{
        name: ENTITY_WEAPON_SHOP_ROUTE,
        params: { id: entityStore.entity?.entity.id },
      }"
      icon="sports_martial_arts"
      class="wide"
      >Weapon Shop</BaseButton
    >
  </div>
  <div class="mb-128"></div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseFraction from "@/components/Base/BaseFraction.vue";
import ItemTable from "@/components/Items/ItemTable.vue";
import { useEntityStore } from "@/stores/entity";
import router, {
  ENTITY_ITEMS_ROUTE,
  ENTITY_ITEM_SHOP_ROUTE,
  ENTITY_WEAPON_SHOP_ROUTE,
} from "@/router";
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

const weapons = computed(() =>
  entityStore.consolidatedItems.filter((item) => item.type === "weapon")
);
const otherItems = computed(() =>
  entityStore.consolidatedItems.filter((item) => item.type !== "weapon")
);

const showEditSection = computed(
  () => entityStore.canEdit && entityStore.entity?.entity.type === "CHARACTER"
);
</script>
