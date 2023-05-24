import { z } from "zod";
import {
  baseAttributeFieldValidator,
  giftValidator,
  nameValidator,
  type BaseEntityAttribute,
  type CharacterGift,
  type EntityAttribute,
  type HTMLString,
  type UncompleteEntityAbility,
  type UncompleteEntityItem,
} from "../backendTypes";
import { namesToItems } from "../itemUtils";
import { useJsonStore } from "@/stores/jsonStorage";
import { giftBoonCopy } from "./giftBoonsCopy";

export const AttributeSelectionsValidator = z.object({
  childAttrs: baseAttributeFieldValidator.array(),
  adultAttrs: baseAttributeFieldValidator.array(),
  noGiftAttrs: baseAttributeFieldValidator.array(),
  badAttrs: baseAttributeFieldValidator.array(),
  grate1: baseAttributeFieldValidator.array(),
  grate3: baseAttributeFieldValidator.array(),
});
export const RadioSelectionsValidator = z.object({
  sideItem: z.string(),
  itemSet: z.string(),
  guildRank: z.string(),
});
export const characterCreateOptionsValidator = z.object({
  name: nameValidator,
  gift: giftValidator.optional(),
  attributeSelections: AttributeSelectionsValidator,
  radioSelections: RadioSelectionsValidator,
  desc: z.string(),
  backstory: z.string(),
  quests: z.string().array().length(3),
  boon: z.string().optional(),
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

export const ATTR_FILTERS_ON_GIFT_SELECTION: (keyof AttributeSelections)[] = [];
export const ATTR_RESET_ON_GIFT_SELECTION: (keyof AttributeSelections)[] = [
  "noGiftAttrs",
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
  },
  adultAttrs: {
    max: 3,
  },
  noGiftAttrs: {
    max: 3,
  },
  badAttrs: {
    max: 3,
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
  };
};

export const RADIO_OPTIONS: RadioButtonOptionsDetails = {
  itemSet: {
    options: {
      chef: "**Chef:** 3 Rations, 3 Tasty Waters, 1 Frying Pan, 1 Cooking Kit",
      dungeoneer:
        "**Dungeoneer:** 1 Flare Rocket, 1 Lockpick set, 1 Flint and Steel, 1 Rope, 1 bag of Sounding Stones, 1 Lux Ward, 1 Lantern",
      merchant:
        "**Merchant:** 1 Elixir of Energy, 1 Rope, 1 Writing Kit, 1 Lantern, 3 Coffee or Alcohol",
      medic:
        "**Medic:** 3 Bandages, 2 Healing Salves, 1 Godfire, 1 Sour Blessing, 1 Elixir of Life",
      scientist:
        "**Scientist:** 1 Lux Ward, 1 Elixir of Focus, 1 Compass, 1 Writing Kit, 1 Bullseye Lantern",
      traveler: "**Traveler:** 1 Bedroll, 1 Lux Ward, 1 Spyglass, 6 Rations",
    },
  },
  sideItem: {
    options: {
      meaningful: `**Something meaningful:** Gain a Memento, an item with 1 Bulk.
        You can spend your Memento at a narratively meaningful moment for a +6 bonus to any one check.`,
      eat: `**Something to eat:** Gain a Snack, an item with 1 Bulk.
        You can eat your Snack during any Rest to fully heal your HP, MP, and Vim once.`,
      coin: `**Some coin:** Gain 150 sp.`,
    },
  },
  guildRank: {
    options: {
      recruit: `**Recruit:** A freshly recruited adventurer with 0-3 months of experience.`,
      member: `**Member:** An accepted but unremarkable member of the guild; typically 3-18 months of experience.`,
      veteran: `**Veteran:** A senior member of the guild, having at least 3 years of adventuring experience.`,
      officer: `**Officer:** A high-ranking adventurer, often retired from the field and having more executive or administrative duties.`,
    },
  },
};

const sideItemMap: Record<string, UncompleteEntityItem> = {
  meaningful: {
    name: "Memento",
    bulk: 0,
    type: "consumable",
    desc: "Memento from character creation. You can spend your Memento at a narratively meaningful moment for a +6 bonus to any one check.",
    active: false,
  },
  eat: {
    name: "Snack",
    bulk: 1,
    type: "consumable",
    desc: "Snack from character creation. You can eat your Snack during any Rest to fully heal your HP, MP, and Vim once.",
    uses: { heal: { attr: { hp: 1000, mp: 1000, vim: 1000 } } },
    active: false,
  },
};

const guildRankAbilityMap: Record<string, UncompleteEntityAbility> = {
  recruit: {
    name: "Guild Rank: Recruit",
    effect: "Once per Quest, a Recruit can reroll any roll.",
    custom_fields: {
      path: "Guild Ranks",
      activation: "Quest",
    },
    active: false,
  },
  member: {
    name: "Guild Rank: Member",
    effect:
      "Once per Rest, when a Member would reach 0 HP, Vim, or MP, they gain 1 of that pool. This effect can trigger only once per Rest across all pools.",
    custom_fields: {
      path: "Guild Ranks",
      activation: "Rest",
      cost: { rest: true },
    },
    active: false,
  },
  veteran: {
    name: "Guild Rank: Veteran",
    effect:
      "Once per Rest, they may reroll an Attribute check if that Attribute is 3 or higher.",
    custom_fields: {
      path: "Guild Ranks",
      activation: "Rest",
      cost: { rest: true },
    },
    active: false,
  },
  officer: {
    name: "Guild Rank: Officer",
    effect: "Once per Quest, Officers gain 6d6 * 10 sp.",
    custom_fields: {
      path: "Guild Ranks",
      activation: "Quest",
    },
    active: false,
  },
};

// Combat stat functions

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

export const calculateXP = () => {
  const sum = 1000;
  return sum;
};

export const calculateSP = (options: CharacterCreateOptions) => {
  let sum = 0;
  if (options.radioSelections.sideItem === "coin") {
    sum += 150;
  }
  return sum;
};

export const DEFAULT_HERO = 3;
export const DEFAULT_HERO_MAX = 9;

export const calculateItems = (
  options: CharacterCreateOptions
): UncompleteEntityItem[] => {
  const jsonStore = useJsonStore();
  if (jsonStore.shopItems === undefined) {
    return [];
  }

  // all characters start with both of these weapons for free
  const itemNames: string[] = [
    "Functional Outfit",
    "Melee Blade",
    "Ranged Sidearm",
  ];

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
  const fullItems = namesToItems(jsonStore.shopItems, itemNames);

  const sideItem = sideItemMap[options.radioSelections.sideItem];
  if (sideItem) {
    fullItems.push(sideItem);
  }

  return fullItems;
};

export const calculateAbilities = (
  options: CharacterCreateOptions
): UncompleteEntityAbility[] => {
  const abilities: UncompleteEntityAbility[] = [];

  const boon = options.boon && giftBoonCopy[options.boon];
  if (boon) {
    abilities.push(boon.ability);
  }

  const guildRank = guildRankAbilityMap[options.radioSelections.guildRank];
  if (guildRank) {
    abilities.push(guildRank);
  }

  return abilities;
};
