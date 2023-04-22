import { solveEquation } from "./attributeUtils";
import type {
  EntityAttribute,
  EntityItem,
  UpdatedEntityAttributes,
} from "./backendTypes";

export type ResultReason<T> = {
  reason: string;
  result: T;
};

const weaponCategoryAdjust = (
  weapon: EntityItem,
  attrs: UpdatedEntityAttributes,
  type: "acc" | "dmg"
): ResultReason<number> | undefined => {
  if (!weapon.custom_fields?.category) {
    return undefined;
  }
  const accKey = `${weapon.custom_fields.category.toLowerCase()}_${type}`;
  const accAdjust = attrs[accKey as EntityAttribute];
  if (accAdjust) {
    return {
      reason: accAdjust.reason?.join(", ") ?? "",
      result: accAdjust.val,
    };
  }
  return undefined;
};

const attributeBonus = (
  weapon: EntityItem,
  attrs: UpdatedEntityAttributes
): number => {
  if (!weapon.custom_fields?.attr) {
    return 0;
  }
  const solved = solveEquation(weapon.custom_fields.attr, attrs);
  return solved ?? 0;
};

export const weaponAccuracy = (
  weapon: EntityItem,
  attrs: UpdatedEntityAttributes
): ResultReason<number> => {
  let acc = attributeBonus(weapon, attrs) * 10;
  let reason = weapon.custom_fields?.attr ?? "";
  const categoryAdjust = weaponCategoryAdjust(weapon, attrs, "acc");
  if (categoryAdjust) {
    acc += categoryAdjust.result;
    reason += ` + ${categoryAdjust.reason}`;
  }
  const baseAdjust = attrs.acc;
  if (baseAdjust) {
    acc += baseAdjust.val;
    reason += ` + ${baseAdjust.reason?.join(", ") ?? ""}`;
  }
  if (acc < 0) {
    acc = 0;
  }
  return { result: acc, reason };
};

export const baseDiceString = (weapon: EntityItem): string => {
  if (!weapon.custom_fields?.dmg) {
    return "";
  }
  const [first] = weapon.custom_fields.dmg.match(/\d*d\d+([+-]\d+)*/gm) || [];
  return first ? first : "";
};

export const enhancedBaseDiceString = (
  weapon: EntityItem,
  attrs: UpdatedEntityAttributes
): string => {
  return (
    baseDiceString(weapon) +
    number2MathString(attributeBonus(weapon, attrs)) +
    number2MathString(weaponCategoryAdjust(weapon, attrs, "dmg")?.result ?? 0) +
    number2MathString(attrs.dmg?.val ?? 0)
  );
};

export const enhancedDmgString = (
  weapon: EntityItem,
  enhancedBaseDiceString: string
): string => {
  if (!weapon.custom_fields || !weapon.custom_fields.dmg) {
    return "";
  }
  return weapon.custom_fields.dmg.replace(
    baseDiceString(weapon),
    enhancedBaseDiceString
  );
};

const number2MathString = (num: number): string => {
  if (num === 0) {
    return "";
  }
  return num > 0 ? `+${num.toString()}` : num.toString();
};
