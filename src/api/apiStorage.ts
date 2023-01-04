import {
  WEAPON_TYPES_KEY,
  type ShopItem,
  shopItemValidator,
  SHOP_ITEMS_KEY,
  pathsAndAbilitiesValidator,
  ABILITIES_KEY,
  type PathsAndAbilites,
} from "@/utils/backendTypes";
import axios from "axios";

const JSON_STORAGE_PUBLIC_URL =
  // process.env.JSON_STORAGE_URL ??
  "https://pub-8e2f06dbcb7b4dde8553a52dd656dbee.r2.dev";

export const fetchWeaponTypesApi = async (): Promise<ShopItem[]> => {
  return shopItemValidator
    .array()
    .parseAsync(
      (await axios.get(`${JSON_STORAGE_PUBLIC_URL}/${WEAPON_TYPES_KEY}`)).data
    );
};

export const fetchShopItemsApi = async (): Promise<ShopItem[]> => {
  return shopItemValidator
    .array()
    .parseAsync(
      (await axios.get(`${JSON_STORAGE_PUBLIC_URL}/${SHOP_ITEMS_KEY}`)).data
    );
};

export const fetchAbilitiesApi = async (): Promise<PathsAndAbilites> => {
  return pathsAndAbilitiesValidator.parseAsync(
    (await axios.get(`${JSON_STORAGE_PUBLIC_URL}/${ABILITIES_KEY}`)).data
  );
};
