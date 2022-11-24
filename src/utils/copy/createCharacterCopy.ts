import { z } from "zod";
import {
  ATTRIBUTES,
  baseAttributeFieldValidator,
  giftValidator,
  nameValidator,
  type BaseEntityAttribute,
  type CharacterGift,
  type EntityAttribute,
  type HTMLString,
} from "../backendTypes";

export const AttributeSelectionsValidator = z.object({
  childAttrs: baseAttributeFieldValidator.array(),
  adultAttrs: baseAttributeFieldValidator.array(),
  additionalAttrs: baseAttributeFieldValidator.array(),
  badAttrs: baseAttributeFieldValidator.array(),
  grate1: baseAttributeFieldValidator.array(),
  grate3: baseAttributeFieldValidator.array(),
});
export const RadioSelectionsValidator = z.object({
  additionalAttrChoice: z.string(),
  sideItem: z.string(),
  rememberItem: z.string(),
  outfit: z.string(),
  itemSet: z.string(),
  experience: z.string(),
});
export const characterCreateOptionsValidator = z.object({
  name: nameValidator,
  gift: giftValidator.optional(),
  attributeSelections: AttributeSelectionsValidator,
  radioSelections: RadioSelectionsValidator,
});
export type AttributeSelections = z.infer<typeof AttributeSelectionsValidator>;
export type RadioSelections = z.infer<typeof RadioSelectionsValidator>;
export type CharacterCreateOptions = z.infer<
  typeof characterCreateOptionsValidator
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

export const ATTR_FILTERS_ON_GIFT_SELECTION: (keyof AttributeSelections)[] = [
  "badAttrs",
];

export const giftMatchesAttr = (
  gift: CharacterGift | undefined,
  attr: BaseEntityAttribute
): boolean => {
  return !gift ? false : GIFT_TO_ATTR_MAP[gift] === attr;
};

export type AttributeSelectionOptionsDetails = {
  [key in keyof AttributeSelections]: {
    max: number | ((options: CharacterCreateOptions) => number);
    filterLists?: (keyof AttributeSelections)[];
    disabledGenerator?: (
      options: CharacterCreateOptions
    ) => BaseEntityAttribute[];
    diff?: number; // defaults to 1
  };
};

export const ATTR_OPTIONS: AttributeSelectionOptionsDetails = {
  childAttrs: {
    max: 3,
    filterLists: ["additionalAttrs", "badAttrs"],
  },
  adultAttrs: {
    max: 3,
    filterLists: ["additionalAttrs", "badAttrs"],
  },
  additionalAttrs: {
    max: (options) => {
      switch (options.radioSelections.additionalAttrChoice) {
        case "any":
          return 1;
        case "one":
          return 2;
        case "zero":
          return 3;
      }
      return 0;
    },
    filterLists: ["badAttrs"],
    disabledGenerator: (options) => {
      switch (options.radioSelections.additionalAttrChoice) {
        case "one":
          return ATTRIBUTES.filter(
            // block if attribute has only been selected by one of the previous options
            (attr) =>
              giftMatchesAttr(options.gift, attr) ||
              options.attributeSelections.childAttrs.includes(attr) ===
                options.attributeSelections.adultAttrs.includes(attr)
          );
        case "zero":
          // block if any attribute modifiers have already been selected
          return ATTRIBUTES.filter(
            (attr) =>
              giftMatchesAttr(options.gift, attr) ||
              options.attributeSelections.childAttrs.includes(attr) ||
              options.attributeSelections.adultAttrs.includes(attr)
          );
      }
      // don't block any choices
      return [];
    },
  },
  badAttrs: {
    max: 1,
    disabledGenerator: (options) => {
      return ATTRIBUTES.filter(
        (attr) =>
          giftMatchesAttr(options.gift, attr) ||
          options.attributeSelections.childAttrs.includes(attr) ||
          options.attributeSelections.adultAttrs.includes(attr) ||
          options.attributeSelections.additionalAttrs.includes(attr)
      );
    },
    diff: -1,
  },
  grate1: { max: 1, diff: -1 },
  grate3: { max: 1 },
};

export type RadioButtonOptionsDetails = {
  key: keyof RadioSelections;
  options: {
    [key: string]: HTMLString;
  };
  clearAdditionalAttrs?: boolean;
};

export const ADDITIONAL_ATTRS_CHOICE_OPTIONS: RadioButtonOptionsDetails = {
  key: "additionalAttrChoice",
  options: {
    any: "Add 1 to one Attribute of your choice",
    one: "Add 1 to two Attributes at 1",
    zero: "Add 1 to three Attributes at 0",
  },
  clearAdditionalAttrs: true,
};

export const calculateAttribute = (
  options: CharacterCreateOptions,
  attr: BaseEntityAttribute
): number => {
  let sum = 0;
  if (giftMatchesAttr(options.gift, attr)) {
    sum += GIFT_ATTR_BONUS;
  }
  Object.entries(options.attributeSelections).forEach(
    ([attrSel, selections]) => {
      if (selections.includes(attr)) {
        let diff = ATTR_OPTIONS[attrSel as keyof AttributeSelections].diff;
        if (diff === undefined) {
          diff = 1;
        }
        sum += diff;
      }
    }
  );
  return sum;
};

// Combat stat functions

export const HP_BASE_VAL = 20;
export const MP_BASE_VAL = 6;
export const VIM_BASE_VAL = 20;
export const INIT_BASE_VAL = 0;
export const SPEED_BASE_VAL = 3;

export const DEFAULT_HERO = 3;
export const DEFAULT_HERO_MAX = 9;

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
