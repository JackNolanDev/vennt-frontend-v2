import { fetchShopItemsApi, fetchWeaponTypesApi } from "@/api/apiStorage";
import type { ShopItem } from "@/utils/backendTypes";
import { defineStore } from "pinia";

interface JsonStore {
  weaponTypes: undefined | ShopItem[];
  shopItems: undefined | ShopItem[];
}

export const useJsonStore = defineStore("json", {
  state(): JsonStore {
    return {
      weaponTypes: undefined,
      shopItems: undefined,
    };
  },
  actions: {
    async fetchWeaponTypes() {
      if (!this.weaponTypes) {
        this.weaponTypes = await fetchWeaponTypesApi();
      }
    },
    async fetchShopItems() {
      if (!this.shopItems) {
        this.shopItems = await fetchShopItemsApi();
      }
    },
  },
});
