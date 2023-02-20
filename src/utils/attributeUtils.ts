import { useEntityStore } from "@/stores/entity";
import mexp from "math-expression-evaluator";
import {
  ATTRIBUTES_SET,
  type CollectedEntity,
  type EntityAttribute,
  type EntityItem,
  type FullCollectedEntity,
  type PartialEntityAttributes,
  type UpdatedEntityAttribute,
  type UpdatedEntityAttributes,
  type UpdateEntityAttributes,
  type UseAttrMap,
} from "./backendTypes";
import { hpDiffStr, vimDiffStr, mpDiffWis } from "./copy/createCharacterCopy";

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

export const getMaxAttr = (
  attr: EntityAttribute
): EntityAttribute | undefined => {
  if (attr in attrMaxMap) {
    return attrMaxMap[attr];
  }
  return undefined;
};

export const getBaseAttr = (
  attr: EntityAttribute
): EntityAttribute | undefined => {
  if (attr in attrBaseMap) {
    return attrBaseMap[attr];
  }
  return undefined;
};

export const attrFullName = (attr: EntityAttribute): string => {
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
    return "Maximum " + attrFullName(baseAttr);
  }
  return attrShortName(attr);
};

export const attrShortName = (attr: EntityAttribute): string => {
  if (attr === "init") {
    return "Initiative";
  }
  if (attr.length <= 2 || ATTRIBUTES_SET.has(attr)) {
    return attr.toUpperCase();
  }
  const baseAttr = getBaseAttr(attr);
  if (baseAttr !== undefined) {
    return "Max " + attrShortName(baseAttr);
  }
  return attr.charAt(0).toUpperCase() + attr.slice(1);
};

export const xp2Level = (xp?: number) => {
  if (xp === undefined) {
    return 0;
  }
  const level = Math.floor(xp / 1000);
  // if xp < 1000, still return level 1
  return level <= 0 ? 1 : level;
};

export const calcLevelDiff = (newXP: number, originalXP: number) => {
  return xp2Level(newXP) - xp2Level(originalXP);
};
export const calcLevelDiffEntity = (newXP: number, entity: CollectedEntity) => {
  const originalXP = entity.entity.attributes.xp;
  return calcLevelDiff(newXP, originalXP !== undefined ? originalXP : 0);
};

export const generateDefaultAdjustMsg = (
  attr: EntityAttribute,
  adjust: number
) => {
  if (adjust === 0) {
    return "";
  }
  const increased = adjust > 0;
  if (["hp", "mp", "vim", "hero", "xp", "sp"].includes(attr)) {
    let pre = "";
    switch (attr) {
      case "hp":
        pre = increased ? "Healed" : "Lost";
        break;
      case "mp":
      case "vim":
        pre = increased ? "Gained" : "Lost";
        break;
      case "hero":
        pre = increased ? "Gained" : "Used";
        break;
      case "xp":
        pre = increased ? "Earned" : "Lost";
        break;
      case "sp":
        pre = increased ? "Gained" : "Spent";
        break;
    }
    return `${pre} ${Math.abs(adjust)} ${attr}`;
  }
  let pre = "Increased";
  if (!increased) {
    pre = "Decreased";
  }
  return `${pre} ${attr} by ${Math.abs(adjust)}`;
};

export const adjustAttrsObject = (
  entity: FullCollectedEntity,
  adjustAttrs: PartialEntityAttributes,
  propagateChanges = true,
  enforceMaximums = false
): PartialEntityAttributes => {
  const attrs: PartialEntityAttributes = {};
  const defaultVal = (attr: EntityAttribute): number => {
    if (entity.entity.attributes[attr] !== undefined)
      return entity.entity.attributes[attr] as number;
    return 0;
  };
  const currentVal = (attr: EntityAttribute): number => {
    if (attrs[attr] !== undefined) return attrs[attr] as number;
    return defaultVal(attr);
  };

  // 1. get resulting effects
  Object.entries(adjustAttrs).forEach(([attrIn, adjustment]) => {
    const attr = attrIn as EntityAttribute;
    const newVal = currentVal(attr) + adjustment;
    attrs[attr] = newVal;
    if (propagateChanges) {
      // HP & VIM
      if (attr === "str") {
        attrs.max_hp = currentVal("max_hp") + hpDiffStr(adjustment);
        attrs.max_vim = currentVal("max_vim") + vimDiffStr(adjustment);
      }
      if (attr === "xp") {
        const levelDiff = calcLevelDiff(newVal, defaultVal("xp"));
        if (levelDiff !== 0) {
          attrs.max_hp = currentVal("max_hp") + levelDiff;
          attrs.max_vim = currentVal("max_vim") + levelDiff;
        }
      }
      // MP
      if (attr === "wis") {
        attrs.max_mp = currentVal("max_mp") + mpDiffWis(adjustment);
      }
      // SPEED
      if (attr === "agi") {
        attrs.speed = currentVal("speed") + adjustment;
      }
      // INIT
      if (attr === "agi" || attr === "dex") {
        attrs.init = currentVal("init") + adjustment;
      }
    }
  });

  // 2. clamp logic
  Object.entries(attrs).forEach(([attrIn, maxVal]) => {
    const attr = attrIn as EntityAttribute;
    const baseAttr = getBaseAttr(attr);
    if (baseAttr) {
      const originalBaseVal = defaultVal(baseAttr);
      const originalVal = defaultVal(attr);
      if (
        originalBaseVal <= originalVal &&
        currentVal(baseAttr) > maxVal
        // example case here is hp = 10, maxHp = 10 -> maxHp changed to 7, hp should also be changed to 7
        // if hp = 15, maxHp = 10 -> maxHp changed to 7, keep hp at 15
      ) {
        attrs[baseAttr] = maxVal;
      }
    }
  });

  // 3. enforce zero minimums
  Object.entries(attrs).forEach(([attrIn, val]) => {
    const attr = attrIn as EntityAttribute;
    if (MIN_ZEROS.has(attr) && val < 0) {
      attrs[attr] = 0;
    }
  });

  // 4. enforce maximums
  if (enforceMaximums) {
    Object.entries(attrs).forEach(([attrIn, val]) => {
      const attr = attrIn as EntityAttribute;
      const maxAttr = getMaxAttr(attr);
      if (maxAttr && currentVal(maxAttr) && val > currentVal(maxAttr)) {
        attrs[attr] = currentVal(maxAttr);
      }
    });
  }

  return attrs;
};

export const adjustAttrsAPI = async (
  entity: FullCollectedEntity,
  adjustAttrs: PartialEntityAttributes,
  msg?: string,
  propagateChanges = true,
  enforceMaximums = false
): Promise<boolean> => {
  const attrs = adjustAttrsObject(
    entity,
    adjustAttrs,
    propagateChanges,
    enforceMaximums
  );

  if (Object.keys(attrs).length === 0) {
    return false;
  }

  const entityStore = useEntityStore();
  if (propagateChanges && attrs.xp) {
    const levelDiff = calcLevelDiffEntity(attrs.xp, entity);
    if (levelDiff > 0) {
      entityStore.levelsToProcess = levelDiff;
    }
  }
  const request: UpdateEntityAttributes = { attributes: attrs };
  if (msg) {
    request.message = msg;
  }
  await entityStore.updateEntityAttributes(entity.entity.id, request);
  return true;
};

export const entityAttributesMap = (
  entity: CollectedEntity
): UpdatedEntityAttributes => {
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

  const appendAdjustItem = (attr: EntityAttribute, item: EntityItem) => {
    const attrCheck = attrs[attr];
    if (attrCheck === undefined) {
      attrs[attr] = { val: 0 };
    }
    const attrMap = attrs[attr] as UpdatedEntityAttribute;
    if (!attrMap.items) {
      attrMap.items = [item];
    } else {
      attrMap.items.push(item);
    }
  };

  const equations: { [attr in EntityAttribute]?: string } = {};

  // 2. Fetch effects from items
  entity.items.forEach((item) => {
    if (
      item.uses &&
      item.uses.adjust &&
      item.active &&
      !item.custom_fields?.in_storage
    ) {
      Object.entries(item.uses.adjust.attr).forEach(([attrIn, val]) => {
        const attr = attrIn as EntityAttribute;
        if (typeof val === "string") {
          equations[attr] = val;
        } else {
          alterAttrs(attr, val);
        }
        appendAdjustItem(attr, item);
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
    const parsed = solveEquation(equation, attrs);
    if (parsed !== undefined) {
      const attrMap = attrs[attr as EntityAttribute];
      if (attrMap) {
        // replace value instead of adjusting it
        attrMap.val = parsed;
      } else {
        alterAttrs(attr as EntityAttribute, parsed);
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
};

export const solvePendingEquations = (
  usesMap: UseAttrMap,
  attrs: UpdatedEntityAttributes
): PartialEntityAttributes => {
  const cleaned: PartialEntityAttributes = {};
  Object.entries(usesMap).forEach(([attrIn, val]) => {
    const attr = attrIn as EntityAttribute;
    if (typeof val === "string") {
      cleaned[attr] = solveEquation(val, attrs);
    } else {
      cleaned[attr] = val;
    }
  });
  return cleaned;
};

export const solveEquation = (
  equation: string,
  attrs: UpdatedEntityAttributes
): number | undefined => {
  // replace any possible variables with current values
  Object.entries(attrs).forEach(([replaceAttr, replaceVal]) => {
    equation = equation.replaceAll(replaceAttr, replaceVal.val.toString());
  });
  // ensure all variables have been removed from the equation before attempting to solve it
  if (/^[\d+\-*/() ]+$/.test(equation)) {
    try {
      return parseInt(mexp.eval(equation));
    } catch {
      console.log(`solving equation failed: ${equation}`);
    }
    return undefined;
  }
};
