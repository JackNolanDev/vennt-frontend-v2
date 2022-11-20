import mexp from "math-expression-evaluator";
import {
  ATTRIBUTES_SET,
  type CollectedEntity,
  type EntityAttribute,
  type UpdatedEntityAttributes,
} from "./backendTypes";

export const MIN_ZEROS = new Set([
  "hp",
  "max_hp",
  "vim",
  "max_vim",
  "mp",
  "max_mp",
  "hero",
  "max_hero",
  "xp",
  "armor",
  "speed",
]);

const attrMaxMap: { [attr in EntityAttribute]?: EntityAttribute } = {
  hp: "max_hp",
  mp: "max_mp",
  vim: "max_vim",
  hero: "max_hero",
};

const attrBaseMap: { [attr in EntityAttribute]?: EntityAttribute } = {
  max_hp: "hp",
  max_mp: "mp",
  max_vim: "vim",
  max_hero: "hero",
};

export function getMaxAttr(attr: EntityAttribute): EntityAttribute | undefined {
  if (attr in attrMaxMap) {
    return attrMaxMap[attr];
  }
  return undefined;
}

export function getBaseAttr(
  attr: EntityAttribute
): EntityAttribute | undefined {
  if (attr in attrBaseMap) {
    return attrMaxMap[attr];
  }
  return undefined;
}

export function attrFullName(attr: EntityAttribute): string {
  const nameMap = {
    per: "Perception",
    tek: "Technology",
    agi: "Agility",
    dex: "Dexterity",
    int: "Intelligence",
    spi: "Spirit",
    str: "Strength",
    wis: "Wisdom",
    cha: "Charisma",
    hero: "Hero Points",
  };
  if (attr in nameMap) {
    return nameMap[attr as keyof typeof nameMap];
  }
  const baseAttr = getBaseAttr(attr);
  if (baseAttr !== undefined) {
    return "Max " + attrFullName(baseAttr);
  }
  return attrShortName(attr);
}

export function attrShortName(attr: EntityAttribute) {
  if (attr === "init") {
    return "Initiative";
  }
  if (attr.length <= 2 || ATTRIBUTES_SET.has(attr)) {
    return attr.toUpperCase();
  }
  return attr.charAt(0).toUpperCase() + attr.slice(1);
}

export function entityAttributesMap(
  entity: CollectedEntity
): UpdatedEntityAttributes {
  const attrs: UpdatedEntityAttributes = {};
  // 1. Directly copy over base attribute values from the character object
  Object.entries(entity.entity.attributes).forEach(([attr, val]) => {
    attrs[attr as EntityAttribute] = { val, base: val };
  });

  const alterAttrs = (attr: EntityAttribute, adjust: number) => {
    const attrMap = attrs[attr];
    if (attrMap === undefined) {
      attrs[attr] = { val: adjust };
    } else {
      attrMap.val += adjust;
    }
  };

  const equations: { [attr in EntityAttribute]?: string } = {};

  // 2. Fetch effects from items
  entity.items.forEach((item) => {
    if (item.uses && item.uses.adjust && item.active) {
      Object.entries(item.uses.adjust.attr).forEach(([attr, val]) => {
        if (typeof val === "string") {
          equations[attr as EntityAttribute] = val;
        } else {
          alterAttrs(attr as EntityAttribute, val);
        }
      });
    }
  });

  // 3. Apply burden effects:
  const burden = attrs.burden;
  if (burden !== undefined) {
    alterAttrs("speed", -burden.val);
    alterAttrs("casting", -burden.val);
  }

  // 4. Apply pending equations
  Object.entries(equations).forEach(([attr, equation]) => {
    Object.entries(attrs).forEach(([replaceAttr, replaceVal]) => {
      equation = equation.replaceAll(replaceAttr, replaceVal.val.toString());
    });
    // ensure all variables have been removed from the equation before attempting to solve it
    if (/^[\d+\-*/() ]+$/.test(equation)) {
      try {
        const parsed = parseInt(mexp.eval(equation));
        const attrMap = attrs[attr as EntityAttribute];
        if (attrMap) {
          attrMap.val = parsed;
        } else {
          alterAttrs(attr as EntityAttribute, parsed);
        }
      } catch {
        // throw out any errors
      }
    }
  });

  // 5. Enforce zero minimums
  Object.entries(attrs).forEach(([attr, map]) => {
    if (MIN_ZEROS.has(attr) && typeof map.val === "number" && map.val < 0) {
      map.val = 0;
    }
  });

  return attrs;
}
