<template>
  <EditItem v-if="showNewItem"></EditItem>
  <ItemDetails v-else-if="entityItem" :item="entityItem"></ItemDetails>
  <ShopItemDetail v-else-if="shopItem" :item="shopItem"></ShopItemDetail>
  <WeaponShopDetail
    v-else-if="weaponType"
    :item="weaponType"
  ></WeaponShopDetail>
  <div v-else>Not found</div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import ItemDetails from "../Items/ItemDetails.vue";
import ShopItemDetail from "../Items/ShopItemDetail.vue";
import WeaponShopDetail from "../Items/WeaponShopDetail.vue";
import { computed } from "vue";
import router from "@/router";
import { useJsonStore } from "@/stores/jsonStorage";
import EditItem from "../Items/EditItem.vue";

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

const showNewItem = computed(
  () => router.currentRoute.value.query.new === "item"
);
const entityItem = computed(() =>
  entityStore.consolidatedItems.find(
    (item) => item.id === router.currentRoute.value.params.detail
  )
);
const shopItem = computed(
  () =>
    jsonStorage.shopItems &&
    jsonStorage.shopItems.find(
      (item) => item.name === router.currentRoute.value.params.detail
    )
);
const weaponType = computed(
  () =>
    jsonStorage.weaponTypes &&
    jsonStorage.weaponTypes.find(
      (item) => item.category === router.currentRoute.value.params.detail
    )
);
</script>
