import {
  attrsRegexStr,
  replaceVariablesInEquation,
  solveEquation,
} from "./attributeUtils";
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

const baseDiceRegex = (attrs: UpdatedEntityAttributes) => {
  const attrsRegexString = attrsRegexStr(attrs);
  return new RegExp(
    `^\\d*d\\d+(?: ?[+\\-*\\/]\\(?(?:\\d*d\\d+|\\d+|${attrsRegexString})\\)?)*`,
    "u"
  );
};

export const baseDiceString = (
  weapon: EntityItem,
  attrs: UpdatedEntityAttributes
): string => {
  if (!weapon.custom_fields?.dmg) {
    return "";
  }
  const [first] = weapon.custom_fields.dmg.match(baseDiceRegex(attrs)) || [];
  return first ? first : "";
};

const addIfExists = (str: string | number | undefined): string =>
  str ? `+${str}` : "";

export const enhancedBaseDiceString = (
  weapon: EntityItem,
  attrs: UpdatedEntityAttributes
): string => {
  const baseString = baseDiceString(weapon, attrs);
  const categoryDmgString = weaponCategoryAdjust(weapon, attrs, "dmg")?.result;
  const baseDmg = attrs.dmg?.val;

  const diceString = `${baseString}${addIfExists(
    weapon.custom_fields?.attr
  )}${addIfExists(categoryDmgString)}${addIfExists(baseDmg)}`;

  return replaceVariablesInEquation(diceString, attrs).cleanedEquation;
};

export const enhancedDmgString = (
  weapon: EntityItem,
  enhancedBaseDiceString: string,
  attrs: UpdatedEntityAttributes
): string => {
  if (!weapon.custom_fields || !weapon.custom_fields.dmg) {
    return "";
  }
  return weapon.custom_fields.dmg.replace(
    baseDiceString(weapon, attrs),
    enhancedBaseDiceString
  );
};

export const relatedAttrsForWeapon = (
  weapon: EntityItem,
  type: "acc" | "dmg"
): EntityAttribute[] => {
  const attrList: EntityAttribute[] = ["dmg"];
  if (weapon.custom_fields?.category) {
    attrList.push(`${weapon.custom_fields.category.toLowerCase()}_${type}`);
  }
  return attrList;
};
