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
  <div v-if="storedItems.length > 0">
    <h2>Items in storage</h2>
    <ItemTable :items="storedItems" class="mb-24"></ItemTable>
  </div>
  <div v-if="activeConsumables.length > 0">
    <h2>Consumed / Active items</h2>
    <ItemTable :items="activeConsumables" class="mb-24"></ItemTable>
  </div>
  <div v-if="showEditSection">
    <BaseButton
      v-if="entityStore.entity?.entity.id"
      :to="{
        name: ENTITY_ITEMS_ROUTE,
        query: { ...$route.query, new: 'item' },
      }"
      icon="add"
      class="wide"
      >Add custom item</BaseButton
    >
    <h2>Buy Items</h2>
    <BaseButton
      v-if="entityStore.entity?.entity.id"
      :to="{
        name: ENTITY_ITEM_SHOP_ROUTE,
        query: { ...$route.query },
      }"
      icon="store"
      class="wide"
      >Item Shop</BaseButton
    >
    <BaseButton
      v-if="entityStore.entity?.entity.id"
      :to="{
        name: ENTITY_WEAPON_SHOP_ROUTE,
        query: { ...$route.query },
      }"
      icon="swords"
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
import {
  ENTITY_ITEMS_ROUTE,
  ENTITY_ITEM_SHOP_ROUTE,
  ENTITY_WEAPON_SHOP_ROUTE,
} from "@/router";
import { computed } from "vue";
import type { ConsolidatedItem } from "vennt-library";

const entityStore = useEntityStore();

const bulkCapacity = computed(() => {
  if (!entityStore.entity) {
    return 0;
  }
  let baseCapacity = 0;
  const carryingCapacity = entityStore.computedAttributes.carrying_capacity;
  if (carryingCapacity) {
    baseCapacity += carryingCapacity.val;
  }
  return (
    baseCapacity +
    entityStore.entity.items
      .filter((item) => item.type === "container")
      .reduce((sum, item) => sum + item.bulk, 0)
  );
});

const bulkSum = computed(() => {
  if (!entityStore.entity) {
    return 0;
  }
  return entityStore.entity.items
    .filter(
      (item) =>
        item.type !== "container" &&
        !item.active &&
        !item.custom_fields?.in_storage,
    )
    .reduce((sum, item) => sum + item.bulk, 0);
});

const itemLists = computed(() => {
  const stored: ConsolidatedItem[] = [];
  const weapons: ConsolidatedItem[] = [];
  const others: ConsolidatedItem[] = [];
  const activeConsumables: ConsolidatedItem[] = [];
  entityStore.consolidatedItems.forEach((item) => {
    if (item.type === "consumable" && item.active) {
      activeConsumables.push(item);
    } else if (item.custom_fields?.in_storage) {
      stored.push(item);
    } else if (item.type === "weapon") {
      weapons.push(item);
    } else {
      others.push(item);
    }
  });
  return { weapons, stored, others, activeConsumables };
});

const weapons = computed(() => itemLists.value.weapons);
const otherItems = computed(() => itemLists.value.others);
const storedItems = computed(() => itemLists.value.stored);
const activeConsumables = computed(() => itemLists.value.activeConsumables);

const showEditSection = computed(
  () => entityStore.canEdit && entityStore.entity?.entity.type === "CHARACTER",
);
</script>
