import { z } from "zod";
import {
  baseAttributeFieldValidator,
  giftValidator,
  nameValidator,
  type CharacterGift,
  type EntityAttribute,
} from "../backendTypes";

export const characterCreateStoreValidator = z.object({
  name: nameValidator,
  gift: giftValidator.optional(),
  childAttrs: baseAttributeFieldValidator.array(),
});
export type CharacterCreateStore = z.infer<
  typeof characterCreateStoreValidator
>;

type GiftToAttrMap = {
  [gift in CharacterGift]: EntityAttribute | undefined;
};

export const GIFT_ATTR_BONUS = 2;
export const GIFT_TO_ATTR_MAP: GiftToAttrMap = {
  Alertness: "per",
  Craft: "tek",
  Alacrity: "agi",
  Finesse: "dex",
  Mind: "int",
  Magic: "spi",
  Rage: "str",
  Science: "wis",
  Charm: "cha",
  None: undefined,
};

export const HP_BASE_VAL = 20;
export const MP_BASE_VAL = 6;
export const VIM_BASE_VAL = 20;
export const INIT_BASE_VAL = 0;
export const SPEED_BASE_VAL = 3;

export const DEFAULT_HERO = 3;
export const DEFAULT_HERO_MAX = 9;

export const calculateAttribute = (
  state: CharacterCreateStore,
  attr: EntityAttribute
): number => {
  let sum = 0;
  if (state.gift && GIFT_TO_ATTR_MAP[state.gift] === attr) {
    sum += GIFT_ATTR_BONUS;
  }
  return sum;
};

// Combat stat functions

export const hpDiffStr = (str: number): number => {
  return str * 3;
};
export const mpDiffWis = (wis: number): number => {
  return wis * 3;
};
export const vimDiffStr = (str: number): number => {
  return str * 3;
};
export const calculateHP = (xp: number, str: number): number => {
  return HP_BASE_VAL + Math.floor(xp / 1000) + hpDiffStr(str);
};
export const calculateMP = (wis: number): number => {
  return MP_BASE_VAL + mpDiffWis(wis);
};
export const calculateVim = (xp: number, str: number): number => {
  return VIM_BASE_VAL + Math.floor(xp / 1000) + vimDiffStr(str);
};
export const calculateInit = (agi: number, dex: number) => {
  return INIT_BASE_VAL + agi + dex;
};
export const calculateSpeed = (agi: number) => {
  return SPEED_BASE_VAL + agi;
};
