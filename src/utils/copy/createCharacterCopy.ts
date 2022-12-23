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
  type UncompleteEntityItem,
} from "../backendTypes";
import { namesToItems } from "../itemUtils";
import { useJsonStore } from "@/stores/jsonStorage";

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
  [key in keyof RadioSelections]: {
    options: {
      [key: string]: HTMLString;
    };
    clearAdditionalAttrs?: boolean;
  };
};

export const RADIO_OPTIONS: RadioButtonOptionsDetails = {
  additionalAttrChoice: {
    options: {
      any: "Add 1 to one Attribute of your choice",
      one: "Add 1 to two Attributes at 1",
      zero: "Add 1 to three Attributes at 0",
    },
    clearAdditionalAttrs: true,
  },
  sideItem: {
    options: {
      sharp:
        "<b>Something sharp:</b> Gain +1 Dexterity and two more Blade weapons.",
      remember: "<b>Something to remember:</b> Gain +1 Spirit OR +1 Charisma.",
      useful:
        "<b>Something useful:</b> Gain +1 Wisdom and 50 sp to spend on Equipment.",
      eat: "<b>Something to eat:</b> Gain +1 Strength and 50 sp to spend on Consumables.",
      read: "<b>Something to read:</b> Gain +1 Intelligence and 100 XP.",
    },
  },
  rememberItem: {
    options: {
      spi: "<b>Spirit:</b> Gain +1 Spirit.",
      cha: "<b>Charisma:</b> Gain +1 Charisma.",
    },
  },
  outfit: {
    options: {
      fashionable:
        "<b>Fashionable:</b> Gain +1 Charisma and 100sp. Your fashionable outfit has a carrying capacity of 5 Bulk.",
      functional:
        "<b>Functional:</b> Gain +1 Agility. Your functional outfit has a carrying capacity of 15 Bulk.",
    },
  },
  itemSet: {
    options: {
      chef: "<b>Chef:</b> 3 Rations, 3 Tasty Waters, 1 Frying Pan, 1 Cooking Kit",
      dungeoneer:
        "<b>Dungeoneer:</b> 1 Flare Rocket, 1 Lockpick set, 1 Flint and Steel, 1 Rope, 1 bag of Sounding Stones, 1 Lux Ward, 1 Lantern",
      merchant:
        "<b>Merchant:</b> 1 Elixir of Energy, 1 Rope, 1 Writing Kit, 1 Lantern, 3 Coffee or Alcohol",
      medic:
        "<b>Medic:</b> 3 Bandages, 2 Healing Salves, 1 Godfire, 1 Sour Blessing, 1 Elixir of Life",
      scientist:
        "<b>Scientist:</b> 1 Lux Ward, 1 Elixir of Focus, 1 Compass, 1 Writing Kit, 1 Bullseye Lantern",
      traveler: "<b>Traveler:</b> 1 Bedroll, 1 Lux Ward, 1 Spyglass, 6 Rations",
    },
  },
  experience: {
    options: {
      starter: `<b>Yes:</b> Gain 1000 XP. When you complete a Novice Path for the first time, gain 300 XP.
    When you complete a Journeyman Path for the first time, gain 700 XP.
    When you complete an Adept Path for the first time, gain 1000 XP.`,
      experienced: "<b>No:</b> Gain 2500 XP.",
    },
  },
};

// Combat stat functions

type RadioOptionAttrsMap = { [key: string]: BaseEntityAttribute };
const RADIO_OPTION_ATTRS_MAP: RadioOptionAttrsMap = {
  sharp: "dex",
  useful: "wis",
  eat: "str",
  read: "int",
  fashionable: "cha",
  Functional: "agi",
};
const REMEMBER_SPECIAL_RADIO_ATTRS_MAP: RadioOptionAttrsMap = {
  spi: "spi",
  cha: "cha",
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
  Object.values(options.radioSelections).forEach((selection) => {
    if (
      RADIO_OPTION_ATTRS_MAP[selection] === attr ||
      (options.radioSelections.sideItem === "remember" &&
        REMEMBER_SPECIAL_RADIO_ATTRS_MAP[selection] === attr)
    ) {
      sum++;
    }
  });
  return sum;
};

export const calculateXP = (options: CharacterCreateOptions) => {
  let sum = 0;
  if (options.radioSelections.experience === "starter") {
    sum += 1000;
  } else if (options.radioSelections.experience === "experienced") {
    sum += 2500;
  }
  if (options.radioSelections.sideItem === "read") {
    sum += 100;
  }
  return sum;
};

export const calculateSP = (options: CharacterCreateOptions) => {
  let sum = 0;
  if (["useful", "eat"].includes(options.radioSelections.sideItem)) {
    sum += 50;
  }
  if (options.radioSelections.outfit === "fashionable") {
    sum += 100;
  }
  return sum;
};

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

export const calculateItems = (
  options: CharacterCreateOptions
): UncompleteEntityItem[] => {
  const jsonStore = useJsonStore();
  if (jsonStore.shopItems === undefined) {
    return [];
  }
  const itemNames: string[] = [];
  if (options.radioSelections.outfit === "fashionable") {
    itemNames.push("Fashionable Outfit");
  } else if (options.radioSelections.outfit === "functional") {
    itemNames.push("Functional Outfit");
  }

  // all characters start with both of these weapons for free
  itemNames.push("Melee Blade", "Ranged Sidearm");

  if (options.radioSelections.sideItem === "sharp") {
    itemNames.push("Melee Blade", "Melee Blade");
  }

  switch (options.radioSelections.itemSet) {
    case "chef":
      itemNames.push(
        "Rations",
        "Rations",
        "Rations",
        "Tasty Water",
        "Tasty Water",
        "Tasty Water",
        "Frying Pan",
        "Cooking Kit"
      );
      break;
    case "dungeoneer":
      itemNames.push(
        "Flare Rocket",
        "Lockpick set",
        "Flint and Steel",
        "Rope",
        "Sounding Stones",
        "Lux Ward",
        "Lantern"
      );
      break;
    case "merchant":
      itemNames.push(
        "Elixir of Energy*",
        "Rope",
        "Writing Kit",
        "Lantern",
        // TODO: let user choose between coffee and alcohol
        "Coffee",
        "Coffee",
        "Coffee"
      );
      break;
    case "medic":
      itemNames.push(
        "Bandages",
        "Bandages",
        "Bandages",
        "Healing Salve",
        "Healing Salve",
        "Godfire",
        "Sour Blessing",
        "Elixir of Life*"
      );
      break;
    case "scientist":
      itemNames.push(
        "Lux Ward",
        "Elixir of Focus*",
        "Compass",
        "Writing Kit",
        "Lantern, Bullseye"
      );
      break;
    case "traveler":
      itemNames.push(
        "Bedroll",
        "Lux Ward",
        "Spyglass",
        "Rations",
        "Rations",
        "Rations",
        "Rations",
        "Rations",
        "Rations"
      );
      break;
  }
  return namesToItems(jsonStore.shopItems, itemNames);
};
