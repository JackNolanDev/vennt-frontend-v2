import {
  validAttributes,
  type ComputedAttributes,
  type EntityAttribute,
  type UseAttrMap,
  type UsesMap,
  type UsesAdjust,
  type DiceSettings,
} from "vennt-library";

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

export const healableAttributes = (
  attrs: ComputedAttributes,
): EntityAttribute[] => {
  const customAttributes = Object.keys(attrs).filter(
    (attr) => !validAttributes.includes(attr),
  );
  return [
    "hp",
    "vim",
    "mp",
    "hero",
    "alerts",
    "actions",
    "reactions",
    "recovery_shock",
    ...customAttributes,
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
  adjustments.reduce<UseAttrMap>((map, { attr, adjust }) => {
    map[attr] = adjust;
    return map;
  }, {});

export const buildUses = ({
  defaultUses,
  usesOverride,
  rollUses,
  healUses,
  adjustUses,
  checkUses,
}: {
  defaultUses?: UsesMap | null;
  usesOverride?: UsesMap | false;
  rollUses: EditRollUses | false;
  healUses: EditUsesAdjustment[] | false;
  adjustUses: EditAdjustUses | false;
  checkUses: EditCheckUses | false;
}): UsesMap | null => {
  if (usesOverride) {
    return usesOverride;
  }

  const newUses = { ...defaultUses };
  if (rollUses && rollUses.attr && rollUses.dice) {
    let heal: UseAttrMap | undefined = undefined;
    if (rollUses.adjusts.length > 0) {
      heal = editUsesAdjustmentsToAttrMap(rollUses.adjusts);
    }
    newUses.roll = { attr: rollUses.attr, dice: rollUses.dice, heal };
  }
  if (healUses && healUses.length > 0) {
    newUses.heal = { attr: editUsesAdjustmentsToAttrMap(healUses) };
  }
  if (adjustUses && adjustUses.time && adjustUses.adjusts.length > 0) {
    newUses.adjust = {
      time: adjustUses.time,
      attr: editUsesAdjustmentsToAttrMap(adjustUses.adjusts),
    };
  }
  if (
    checkUses &&
    checkUses.attr &&
    Object.keys(checkUses.diceSetting).length > 0
  ) {
    newUses.check = {
      attr: checkUses.attr,
      label: checkUses.label,
      dice_settings: checkUses.diceSetting,
    };
  }
  if (Object.keys(newUses).length > 0) {
    return newUses;
  }
  return null;
};
