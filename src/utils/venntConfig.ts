import type { EntityAttribute, UpdatedEntityAttributes } from "./backendTypes";

// TODO: For v0.14 increase to 2000
export const LEVEL_UPS_TO_INCREASE_ATTR = 2;

export const DEFAULT_ATTRS_MAP: UpdatedEntityAttributes = {
  free_hands: { val: 2, reason: ["Default: 2"] },
};

export const DEFAULT_CHARACTER_EQUATIONS: Array<[EntityAttribute, string]> = [
  // attribute damage
  ["agi", "agi - agi_dmg"],
  ["cha", "cha - cha_dmg"],
  ["dex", "dex - dex_dmg"],
  ["int", "int - int_dmg"],
  ["per", "per - per_dmg"],
  ["spi", "spi - spi_dmg"],
  ["str", "str - str_dmg"],
  ["tek", "tek - tek_dmg"],
  ["wis", "wis - wis_dmg"],
  // combat attributes
  ["max_hp", "max_hp + 20 + (xp / 1000) + (3 * str)"],
  ["max_vim", "max_vim + 20 + (xp / 1000) + (str * agi)"],
  ["max_mp", "max_mp + 6 + (3 * wis)"],
  ["init", "init + agi + dex"],
  ["speed", "speed + 3 + agi - burden"],
  ["max_alerts", "max_alerts + agi + per"],
];
