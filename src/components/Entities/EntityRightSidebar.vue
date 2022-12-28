<template>
  <ItemDetails v-if="entityItem" :item="entityItem"></ItemDetails>
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

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

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
