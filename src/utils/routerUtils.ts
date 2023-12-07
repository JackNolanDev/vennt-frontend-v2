import {
  ENTITY_ABILITIES_ROUTE,
  ENTITY_COMBAT_ROUTE,
  ENTITY_ITEMS_ROUTE,
  ENTITY_ITEM_SHOP_ROUTE,
  ENTITY_WEAPON_SHOP_ROUTE,
} from "@/router";
import type { RouteRecordName } from "vue-router";

export const fallbackEntitySidebarPage = (
  name: RouteRecordName | null | undefined,
  fallback: string,
): RouteRecordName => {
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
    return fallback;
  }
  return name;
};
