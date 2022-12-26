import {
  ATTRIBUTES,
  type CollectedEntity,
  type EntityItem,
  type UpdatedEntityAttributes,
} from "./backendTypes";

const hasProficiency = (
  weapon: EntityItem,
  entity: CollectedEntity
): boolean => {
  if (!weapon.custom_fields || !weapon.custom_fields.category) {
    return false;
  }
  const possibleNames = [
    `${weapon.custom_fields.category} Specialist`,
    `${weapon.custom_fields.category} Weapon Proficiency`,
  ];
  return entity.abilities.some((ability) =>
    possibleNames.includes(ability.name)
  );
};

const attributeBonus = (
  weapon: EntityItem,
  attrs: UpdatedEntityAttributes
): number => {
  if (!weapon.custom_fields || !weapon.custom_fields.attr) {
    return 0;
  }
  let attrStr = weapon.custom_fields.attr;
  ATTRIBUTES.forEach((attr) => {
    const attrVal = attrs[attr];
    if (attrVal) {
      attrStr = attrStr.replaceAll(attr, attrVal.val.toString());
    }
  });
  const numbers = [...attrStr.matchAll(/[+-]*\d+/gm)];
  return numbers.reduce((sum, val) => {
    const parsedVal = parseInt(val.toString());
    return sum + (isNaN(parsedVal) ? 0 : parsedVal);
  }, 0);
};

export type ResultReason<T> = {
  reason: string;
  result: T;
};

export const weaponAccuracy = (
  weapon: EntityItem,
  entity: CollectedEntity,
  attrs: UpdatedEntityAttributes
): ResultReason<number> => {
  let acc = attributeBonus(weapon, attrs) * 10;
  let reason = weapon.custom_fields?.attr ?? "";
  if (hasProficiency(weapon, entity)) {
    acc += 10;
    reason += " + proficiency";
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
  entity: CollectedEntity,
  attrs: UpdatedEntityAttributes
): string => {
  return (
    baseDiceString(weapon) +
    number2MathString(attributeBonus(weapon, attrs)) +
    (hasProficiency(weapon, entity) ? "+1" : "")
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
