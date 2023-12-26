import {
  validAttributes,
  type ComputedAttributes,
  type EntityAttribute,
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
