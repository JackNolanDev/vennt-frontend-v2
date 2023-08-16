<template>
  <h1>Weapon shop</h1>
  <h2>List of Weapon Categories</h2>
  <p class="textBlock">
    The weapons listed below are not specific weapons, but rather categories.
    For example, if you want to wield a battleaxe, you might pick your weapon to
    be Brutal. You would then have a battleaxe that has all the properties of
    Brutal weapons. Even though there are examples listed of the common weapons
    of that category, your weapon can be anything. For example, you can have a
    Great frying pan, or a shortbow that you treat as a Shotgun because your
    character tweaked it to use gunpowder to fire the arrows, so it isn’t very
    much like a Bow at all. Some weapons may be Two-Handed.
  </p>
  <div class="cardGroup mb-128">
    <router-link
      v-for="weaponType in purchasable"
      :key="weaponType.category"
      :to="weaponLink(weaponType)"
      class="btn card column padded selectable"
      :class="{ selected: weaponOpenned(weaponType) }"
    >
      <div class="alignRow gap">
        <WeaponIcon :item="weaponType"></WeaponIcon>
        <h3 class="mt-0 mb-0">{{ weaponType.category }}</h3>
      </div>

      <DisplayShopItem :item="weaponType"></DisplayShopItem>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import DisplayShopItem from "@/components/Items/DisplayShopItem.vue";
import WeaponIcon from "@/components/Items/WeaponIcon.vue";
import router, { ENTITY_WEAPON_SHOP_ROUTE } from "@/router";
import { useJsonStore } from "@/stores/jsonStorage";
import type { ShopItem } from "@/utils/backendTypes";
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";

const jsonStorage = useJsonStore();
jsonStorage.fetchWeaponTypes();

const purchasable = computed(() =>
  jsonStorage.weaponTypes.filter((weapon) => weapon.sp)
);
const weaponOpenned = (weapon: ShopItem): boolean =>
  router.currentRoute.value.params.detail == weapon.category;
const weaponLink = (weapon: ShopItem): RouteLocationRaw => {
  if (weaponOpenned(weapon)) {
    const params = { ...router.currentRoute.value.params };
    delete params.detail;
    return {
      name: ENTITY_WEAPON_SHOP_ROUTE,
      params,
      query: router.currentRoute.value.query,
    };
  }
  return {
    name: ENTITY_WEAPON_SHOP_ROUTE,
    params: { ...router.currentRoute.value.params, detail: weapon.category },
    query: router.currentRoute.value.query,
  };
};
</script>

<style scoped>
.cardGroup {
  display: grid;
  grid-template-columns: repeat(3, 1fr [col-start]);
  grid-gap: 8px;
}
/* mobile styles */
@container page (max-width: 900px) {
  .cardGroup {
    grid-template-columns: repeat(2, 1fr [col-start]);
  }
}
@container page (max-width: 600px) {
  .cardGroup {
    grid-template-columns: repeat(1, 1fr [col-start]);
  }
}
</style>
