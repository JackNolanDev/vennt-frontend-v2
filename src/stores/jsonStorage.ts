import {
  fetchAbilitiesApi,
  fetchShopItemsApi,
  fetchWeaponTypesApi,
} from "@/api/apiStorage";
import type { PathsAndAbilities, ShopItem } from "@/utils/backendTypes";
import { getDefaultWeapons } from "@/utils/itemUtils";
import { defineStore } from "pinia";

interface JsonStore {
  weaponTypes: ShopItem[];
  shopItems: ShopItem[];
  abilities: PathsAndAbilities;
}

export const useJsonStore = defineStore("json", {
  state(): JsonStore {
    return {
      weaponTypes: [],
      shopItems: [],
      abilities: { paths: [], abilities: [] },
    };
  },
  getters: {
    defaultWeapons: (state) => getDefaultWeapons(state.weaponTypes),
  },
  actions: {
    async fetchWeaponTypes() {
      if (this.weaponTypes.length === 0) {
        this.weaponTypes = await fetchWeaponTypesApi();
      }
    },
    async fetchShopItems() {
      if (this.shopItems.length === 0) {
        this.shopItems = await fetchShopItemsApi();
      }
    },
    async fetchAbilities() {
      if (this.abilities.abilities.length === 0) {
        this.abilities = await fetchAbilitiesApi();
      }
    },
  },
});
