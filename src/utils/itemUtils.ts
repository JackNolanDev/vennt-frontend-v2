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
  type EntityItemType,
  type FullCollectedEntity,
} from "./backendTypes";

export const defaultWeaponCategories = ["Unarmed", "Improvised"];

export const shopItemToEntityItem = (
  shopItem: ShopItem,
  active?: boolean
): UncompleteEntityItem => {
  const item: UncompleteEntityItem = {
    type: shopItem.type,
    name: shopItem.name ? shopItem.name : "Mysterious Item",
    bulk: shopItem.bulk,
    desc: shopItem.desc,
    custom_fields: {},
    active: active ?? shopItemDefaultActive(shopItem),
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
    if (shopItem.weapon_type) {
      item.custom_fields.weapon_type = shopItem.weapon_type;
    }
  }
  if (shopItem.uses) {
    item.uses = shopItem.uses;
  }
  return item;
};

export const namesToItems = (
  shopItems: ShopItem[],
  names: string[]
): UncompleteEntityItem[] => {
  return names
    .map((name) => shopItems.find((item) => item.name === name))
    .filter((shopItem) => shopItem !== undefined)
    .map((shopItem) => shopItemToEntityItem(shopItem as ShopItem));
};

export const findShopItem = (
  item: EntityItem,
  shopItems: ShopItem[],
  weaponTypes: ShopItem[]
): ShopItem | undefined => {
  const found = shopItems.find(
    (it) =>
      it.name === item.name &&
      it.type === item.type &&
      it.bulk === item.bulk &&
      it.desc === item.desc
  );
  if (found) {
    return found;
  }
  if (!item.custom_fields?.category) {
    return undefined;
  }
  return weaponTypes.find(
    (weapon) => weapon.category === item.custom_fields?.category
  );
};

// Warning: data generated here should not be passed to back end
export const unsafeEnsureFullEntityItem = (
  item: EntityItem
): FullEntityItem => {
  const converted = { ...item } as FullEntityItem;
  if (!converted.id) {
    converted.id = v4();
  }
  if (!converted.entity_id) {
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
    const foundItem =
      !itemEquippable(item) &&
      items.find(
        (search) =>
          search.name === item.name &&
          search.bulk === item.bulk &&
          search.desc === item.desc
      );
    if (!foundItem) {
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

export const isDefaultWeapon = (item: EntityItem): boolean =>
  !!(
    item.custom_fields?.category &&
    defaultWeaponCategories.includes(item.custom_fields.category)
  );

const equippableItemTypes = new Set<EntityItemType>([
  ITEM_TYPE_ARMOR,
  ITEM_TYPE_SHIELD,
  ITEM_TYPE_WEAPON,
]);

export const itemEquippable = (item: EntityItem): boolean => {
  return (
    equippableItemTypes.has(item.type) &&
    !isDefaultWeapon(item) &&
    item.custom_fields?.category !== "Grenade"
  );
};

export const getDefaultWeapons = (weaponTypesList: ShopItem[]) =>
  defaultWeaponCategories
    .map((category) => {
      const found = weaponTypesList.find(
        (weapon) => weapon.category === category
      );
      if (!found) {
        return found;
      }
      const name = `${category} Attack`;
      return {
        ...unsafeEnsureFullEntityItem(shopItemToEntityItem(found)),
        name,
        id: name,
        ids: [name],
      };
    })
    .filter((item) => item) as ConsolidatedItem[];

export const shopItemDefaultActiveDirectFields = (
  type: EntityItemType,
  category?: string
): boolean => equippableItemTypes.has(type) && category !== "Grenade";

export const itemActiveDirectFields = (
  type: EntityItemType,
  category?: string,
  entity?: FullCollectedEntity
): boolean => {
  let base = shopItemDefaultActiveDirectFields(type, category);
  if (base && type !== "weapon" && entity && entity.items.length > 0) {
    base = entity.items.some(
      (existingItem) => existingItem.type === type && existingItem.active
    );
  }
  return base;
};

export const shopItemDefaultActive = (item: ShopItem): boolean =>
  shopItemDefaultActiveDirectFields(item.type, item.category);

export const shopItemActive = (
  item: ShopItem,
  entity?: FullCollectedEntity
): boolean => {
  return itemActiveDirectFields(item.type, item.category, entity);
};
