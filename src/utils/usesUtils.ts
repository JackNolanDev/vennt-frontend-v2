import {
  validAttributes,
  type ComputedAttributes,
  type EntityAttribute,
  type UseAttrMap,
  type UsesMap,
  type UsesAdjust,
  type DiceSettings,
  usesValidator,
} from "vennt-library";
import { numberFieldVal } from "./inputType";

export interface EditRollUses {
  attr: EntityAttribute;
  dice: string;
  adjusts: EditUsesAdjustment[];
}

export interface EditUsesAdjustment {
  attr: EntityAttribute;
  type: "number" | "equation";
  adjust: number | string;
}

export interface EditAdjustUses {
  time: UsesAdjust["time"] | "";
  adjusts: EditUsesAdjustment[];
}

export interface EditCheckUses {
  attr: EntityAttribute;
  label: string;
  diceSetting: DiceSettings;
}

export interface EditUsesState {
  override: string;
  heal: EditUsesAdjustment[];
  roll: EditRollUses;
  adjust: EditAdjustUses;
  check: EditCheckUses;
}

export const BASE_HEAL_ATTRIBUTES = [
  "hp",
  "vim",
  "mp",
  "hero",
  "alerts",
  "actions",
  "reactions",
  "recovery_shock",
  "burning",
  "bleeding",
  "paralysis",
  "stun",
  "agi_dmg",
  "cha_dmg",
  "dex_dmg",
  "int_dmg",
  "per_dmg",
  "spi_dmg",
  "str_dmg",
  "tek_dmg",
  "wis_dmg",
];

export const customAttributes = (
  attrs: ComputedAttributes,
): EntityAttribute[] =>
  Object.keys(attrs).filter((attr) => !validAttributes.includes(attr));

export const healableAttributes = (
  attrs: ComputedAttributes,
): EntityAttribute[] => [...customAttributes(attrs), ...BASE_HEAL_ATTRIBUTES];

export const adjustableAttributes = (
  attrs: ComputedAttributes,
): EntityAttribute[] => {
  return [
    ...customAttributes(attrs),
    ...validAttributes.filter((attr) => !BASE_HEAL_ATTRIBUTES.includes(attr)),
  ];
};

export const attrMapToEditUsesAdjustments = (
  attrMap?: UseAttrMap,
): EditUsesAdjustment[] =>
  Object.entries(attrMap ?? {}).map(([attr, adjust]) => ({
    attr,
    type: typeof adjust === "number" ? "number" : "equation",
    adjust,
  }));

export const editUsesAdjustmentsToAttrMap = (
  adjustments: EditUsesAdjustment[],
): UseAttrMap =>
  adjustments.reduce<UseAttrMap>((map, { attr, type, adjust }) => {
    if (attr) {
      if (type === "number") {
        const convertedAdjust = numberFieldVal(adjust, true);
        if (!isNaN(convertedAdjust)) {
          map[attr] = convertedAdjust;
        }
      } else if (typeof adjust === "string" && adjust.length > 0) {
        map[attr] = adjust;
      }
    }
    return map;
  }, {});

export const usesToState = (
  uses: UsesMap | null | undefined,
): EditUsesState => ({
  override: "",
  roll: {
    attr: uses?.roll?.attr ?? "",
    dice: uses?.roll?.dice ?? "",
    adjusts: attrMapToEditUsesAdjustments(uses?.roll?.heal ?? {}),
  },
  heal: attrMapToEditUsesAdjustments(uses?.heal?.attr ?? {}),
  adjust: {
    time: uses?.adjust?.time ?? "",
    adjusts: attrMapToEditUsesAdjustments(uses?.adjust?.attr ?? {}),
  },
  check: {
    attr: uses?.check?.attr ?? "",
    label: uses?.check?.label ?? "",
    diceSetting: {
      ...uses?.check?.dice_settings,
      ...(uses?.check?.bonus && { end: uses.check.bonus }),
    },
  },
});

const parseUsesOverride = (override: string): UsesMap | false => {
  try {
    const jsonObject = JSON.parse(override);
    return usesValidator.parse(jsonObject);
  } catch (err) {
    return false;
  }
};

export const stateToUses = (
  state: EditUsesState,
  defaultUses: UsesMap | null | undefined,
): { uses: UsesMap | null; overrideInvalid?: boolean } => {
  const { override, roll, heal, adjust, check } = state;
  if (override) {
    const uses = parseUsesOverride(override);
    if (uses) {
      return { uses, overrideInvalid: true };
    }
  }

  const uses = { ...defaultUses };

  if (roll.attr && roll.dice) {
    let heal: UseAttrMap | undefined = undefined;
    if (roll.adjusts.length > 0) {
      heal = editUsesAdjustmentsToAttrMap(roll.adjusts);
    }
    uses.roll = { ...uses.roll, attr: roll.attr, dice: roll.dice, heal };
  } else if (uses.roll) {
    uses.roll = undefined;
  }

  if (heal.length > 0) {
    uses.heal = { ...uses.heal, attr: editUsesAdjustmentsToAttrMap(heal) };
  } else if (uses.heal) {
    uses.heal = undefined;
  }

  if (adjust.time && adjust.adjusts.length > 0) {
    uses.adjust = {
      ...uses.adjust,
      time: adjust.time,
      attr: editUsesAdjustmentsToAttrMap(adjust.adjusts),
    };
  } else if (uses.adjust) {
    uses.adjust = undefined;
  }

  if (check.attr && check.diceSetting) {
    uses.check = {
      ...uses.check,
      attr: check.attr,
      dice_settings: check.diceSetting,
      label: check.label,
    };
  } else if (uses.check) {
    uses.check = undefined;
  }

  if (Object.keys(uses).length > 0) {
    return { uses };
  }
  return { uses: null };
};
