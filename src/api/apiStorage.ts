import { wrapAPI } from "./utils";
import api from "./apiInstance";
import {
  WEAPON_TYPES_KEY,
  type ShopItem,
  shopItemValidator,
  SHOP_ITEMS_KEY,
} from "@/utils/backendTypes";

export const fetchWeaponTypesApi = (): Promise<ShopItem[]> => {
  return wrapAPI(
    () => api.get(`/storage/${WEAPON_TYPES_KEY}`),
    shopItemValidator.array()
  );
};

export const fetchShopItemsApi = (): Promise<ShopItem[]> => {
  return wrapAPI(
    () => api.get(`/storage/${SHOP_ITEMS_KEY}`),
    shopItemValidator.array()
  );
};
