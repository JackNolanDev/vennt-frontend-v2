<template>
  <EditAbility v-if="showNewAbility"></EditAbility>
  <EditItem v-else-if="showNewItem"></EditItem>
  <DamageCalculator v-else-if="damageCalculator"></DamageCalculator>
  <ShopItemDetail v-else-if="shopItem" :item="shopItem"></ShopItemDetail>
  <AbilityDetails
    v-else-if="entityAbility"
    :ability="entityAbility"
    :attrs="entityStore.entityAttributes"
  ></AbilityDetails>
  <AbilitySearchDetails
    v-else-if="searchAbility"
    :ability="searchAbility"
  ></AbilitySearchDetails>
  <ItemDetails v-else-if="entityItem" :item="entityItem"></ItemDetails>
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
import router, { ENTITY_ITEM_SHOP_ROUTE } from "@/router";
import { useJsonStore } from "@/stores/jsonStorage";
import EditItem from "../Items/EditItem.vue";
import { idValidator } from "@/utils/backendTypes";
import AbilityDetails from "../Abilities/AbilityDetails.vue";
import AbilitySearchDetails from "../Abilities/AbilitySearchDetails.vue";
import EditAbility from "../Abilities/EditAbility.vue";
import DamageCalculator from "./DamageCalculator.vue";

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

const isUUID = computed(
  () => idValidator.safeParse(router.currentRoute.value.params.detail).success
);

const showNewItem = computed(
  () => router.currentRoute.value.query.new === "item"
);
const showNewAbility = computed(
  () => router.currentRoute.value.query.new === "ability"
);
const damageCalculator = computed(
  () => router.currentRoute.value.params.detail === "damage"
);
const entityItem = computed(() =>
  isUUID.value
    ? entityStore.consolidatedItems.find(
        (item) => item.id === router.currentRoute.value.params.detail
      )
    : jsonStorage.defaultWeapons.find(
        (weapon) => weapon.name === router.currentRoute.value.params.detail
      )
);
const shopItem = computed(
  () =>
    !isUUID.value &&
    router.currentRoute.value.name === ENTITY_ITEM_SHOP_ROUTE &&
    jsonStorage.shopItems.find(
      (item) => item.name === router.currentRoute.value.params.detail
    )
);
const weaponType = computed(
  () =>
    !isUUID.value &&
    jsonStorage.weaponTypes.find(
      (item) => item.category === router.currentRoute.value.params.detail
    )
);
const entityAbility = computed(
  () =>
    isUUID.value &&
    entityStore.entity?.abilities.find(
      (ability) => ability.id === router.currentRoute.value.params.detail
    )
);
const searchAbility = computed(
  () =>
    !isUUID.value &&
    jsonStorage.abilities.abilities.find(
      (ability) => ability.name === router.currentRoute.value.params.detail
    )
);
</script>
