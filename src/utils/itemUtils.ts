import { v4 } from "uuid";
import {
  type EntityItem,
  type FullEntityItem,
  type ShopItem,
  type UncompleteEntityItem,
  type ConsolidatedItem,
  ITEM_TYPE_ARMOR,
  ITEM_TYPE_CONSUMABLE,
  ITEM_TYPE_CONTAINER,
  ITEM_TYPE_EQUIPMENT,
  ITEM_TYPE_SHIELD,
  ITEM_TYPE_WEAPON,
} from "./backendTypes";
import importedShopItems from "./data/items.json";

export const shopItems = importedShopItems as ShopItem[];

export const shopItemToEntityItem = (
  shopItem: ShopItem,
  active = false
): UncompleteEntityItem => {
  const item: UncompleteEntityItem = {
    type: shopItem.type,
    name: shopItem.name ? shopItem.name : "Mysterious Item",
    bulk: shopItem.bulk,
    desc: shopItem.desc,
    custom_fields: {},
    active,
  };
  if (item.custom_fields) {
    if (shopItem.attr) {
      item.custom_fields.attr = shopItem.attr;
    }
    if (shopItem.category) {
      item.custom_fields.category = shopItem.category;
    }
    if (shopItem.courses) {
      item.custom_fields.courses = shopItem.courses;
    }
    if (shopItem.dmg) {
      item.custom_fields.dmg = shopItem.dmg;
    }
    if (shopItem.range) {
      item.custom_fields.range = shopItem.range;
    }
    if (shopItem.special) {
      item.custom_fields.special = shopItem.special;
    }
    if (shopItem.weaponType) {
      item.custom_fields.weapon_type = shopItem.weaponType;
    }
  }
  if (shopItem.uses) {
    item.uses = shopItem.uses;
  }
  return item;
};

export const namesToItems = (names: string[]): UncompleteEntityItem[] => {
  return names
    .map((name) => shopItems.find((item) => item.name === name))
    .filter((shopItem) => shopItem !== undefined)
    .map((shopItem) => shopItemToEntityItem(shopItem as ShopItem));
};

// Warning: data generated here should not be passed to back end
export const unsafeEnsureFullEntityItem = (
  item: EntityItem
): FullEntityItem => {
  const converted = { ...item } as FullEntityItem;
  if (!converted.id || !converted.entity_id) {
    converted.id = v4();
    converted.entity_id = v4();
  }
  return converted;
};

export const unsafeEnsureFullEntityItems = (
  items: EntityItem[]
): FullEntityItem[] => {
  return items.map((item) => unsafeEnsureFullEntityItem(item));
};

export const consolidateItemList = (
  given: FullEntityItem[]
): ConsolidatedItem[] => {
  const items: ConsolidatedItem[] = [];
  given.forEach((item) => {
    const foundItem = items.find(
      (search) =>
        search.name === item.name &&
        search.bulk === item.bulk &&
        search.desc === item.desc
    );
    if (foundItem === undefined) {
      items.push({ ...item, ids: [item.id] });
    } else {
      foundItem.ids.push(item.id);
    }
  });
  sortConsolidatedItems(items);
  return items;
};

const ITEM_TYPE_WEIGHTS_LIST = [
  ITEM_TYPE_WEAPON,
  ITEM_TYPE_CONSUMABLE,
  ITEM_TYPE_EQUIPMENT,
  ITEM_TYPE_ARMOR,
  ITEM_TYPE_SHIELD,
  ITEM_TYPE_CONTAINER,
];

const ITEM_TYPE_WEIGHTS: { [category: string]: number } = {};
ITEM_TYPE_WEIGHTS_LIST.forEach((category, idx) => {
  ITEM_TYPE_WEIGHTS[category] = idx;
});

export function sortConsolidatedItems(items: ConsolidatedItem[]) {
  items.sort((a, b) => {
    // 1. Sort by item type
    if (
      a.type !== b.type &&
      ITEM_TYPE_WEIGHTS[a.type] !== undefined &&
      ITEM_TYPE_WEIGHTS[b.type] !== undefined
    ) {
      return ITEM_TYPE_WEIGHTS[a.type] - ITEM_TYPE_WEIGHTS[b.type];
    }
    // 2. Sort by item name
    return a.name.localeCompare(b.name);
  });
}
