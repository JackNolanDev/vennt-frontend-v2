<template>
  <BaseButton :to="route" icon="calculate" class="wide"
    >Damage Calculator</BaseButton
  >
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import type { RouteLocationRaw } from "vue-router";
import router, {
  ENTITY_ABILITIES_ROUTE,
  ENTITY_COMBAT_ROUTE,
  ENTITY_ITEMS_ROUTE,
  ENTITY_ITEM_SHOP_ROUTE,
  ENTITY_WEAPON_SHOP_ROUTE,
} from "@/router";

const route = computed((): RouteLocationRaw => {
  let name = router.currentRoute.value.name ?? ENTITY_COMBAT_ROUTE;
  if (
    typeof name !== "string" ||
    ![
      ENTITY_ABILITIES_ROUTE,
      ENTITY_COMBAT_ROUTE,
      ENTITY_ITEMS_ROUTE,
      ENTITY_ITEM_SHOP_ROUTE,
      ENTITY_WEAPON_SHOP_ROUTE,
    ].includes(name)
  ) {
    name = ENTITY_COMBAT_ROUTE;
  }
  return {
    name,
    params: { detail: "damage" },
    query: router.currentRoute.value.query,
  };
});
</script>
