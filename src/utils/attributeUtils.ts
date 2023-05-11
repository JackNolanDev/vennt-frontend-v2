import { useEntityStore } from "@/stores/entity";
import mexp from "math-expression-evaluator";
import {
  ATTRIBUTES_SET,
  validAttributes,
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
import { titleText } from "./textUtils";
import { abilityPassCriteriaCheck } from "./criteriaUtils";
import { DEFAULT_ATTRS_MAP, DEFAULT_CHARACTER_EQUATIONS } from "./venntConfig";

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
  const nameMap: Partial<Record<EntityAttribute, string>> = {
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
  const customName = nameMap[attr];
  if (customName) {
    return customName;
  }
  const baseAttr = getBaseAttr(attr);
  if (baseAttr !== undefined) {
    return "Maximum " + attrFullName(baseAttr);
  }
  return attrShortName(attr);
};

export const attrShortName = (attr: EntityAttribute): string => {
  const nameMap: Partial<Record<EntityAttribute, string>> = {
    init: "Initiative",
    // acc: "Accuracy",
    L: "Level",
  };
  const customName = nameMap[attr];
  if (customName) {
    return customName;
  }
  if (attr.length <= 2 || ATTRIBUTES_SET.has(attr)) {
    return attr.toUpperCase();
  }
  const baseAttr = getBaseAttr(attr);
  if (baseAttr !== undefined) {
    return "Max " + attrShortName(baseAttr);
  }
  return titleText(attr);
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
  entityAttrs: UpdatedEntityAttributes,
  adjustAttrs: PartialEntityAttributes,
  enforceMaximums = false
): PartialEntityAttributes => {
  const attrs: PartialEntityAttributes = {};
  const defaultVal = (
    attr: EntityAttribute,
    fetchAdjustedVal = false
  ): number => {
    if (fetchAdjustedVal) {
      return entityAttrs[attr]?.val ?? 0;
    }
    return entityAttrs[attr]?.base ?? 0;
  };
  const currentVal = (
    attr: EntityAttribute,
    fetchAdjustedVal = false
  ): number => {
    if (attrs[attr] !== undefined) return attrs[attr] as number;
    return defaultVal(attr, fetchAdjustedVal);
  };

  // 1. get resulting effects
  Object.entries(adjustAttrs).forEach(([attrIn, adjustment]) => {
    const attr = attrIn as EntityAttribute;
    const newVal = currentVal(attr) + adjustment;
    attrs[attr] = newVal;
    // TODO: Delete this code. It has been deprecated in favor of using equations that can be updated however we want
    /*
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
    */
  });

  // TODO: Also remove this logic - I don't believe its usually accurate now that attributes are rarely fully defined by their base val
  // OR refactor it to make it work again
  /*
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
  */

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
      if (!maxAttr) {
        return;
      }
      const maxAttrCurrentVal = currentVal(maxAttr, true);
      if (val > maxAttrCurrentVal) {
        attrs[attr] = maxAttrCurrentVal;
      }
    });
  }

  return attrs;
};

export const adjustAttrsAPI = async (
  entity: FullCollectedEntity,
  entityAttrs: UpdatedEntityAttributes,
  adjustAttrs: PartialEntityAttributes,
  msg?: string,
  propagateChanges = true,
  enforceMaximums = false
): Promise<boolean> => {
  const attrs = adjustAttrsObject(entityAttrs, adjustAttrs, enforceMaximums);

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
  const attrs: UpdatedEntityAttributes = structuredClone(DEFAULT_ATTRS_MAP);
  // 1. Directly copy over base attribute values from the character object
  Object.entries(entity.entity.attributes).forEach(([attr, val]) => {
    attrs[attr as EntityAttribute] = {
      val,
      base: val,
      reason: [`Base value: ${val}`],
    };
  });

  const alterAttrs = (
    attr: EntityAttribute,
    adjust: number,
    reason: string
  ) => {
    const attrMap = attrs[attr];
    if (attrMap === undefined) {
      attrs[attr] = { val: adjust, reason: [reason] };
    } else {
      attrMap.val += adjust;
      if (attrMap.reason) {
        attrMap.reason.push(reason);
      }
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

  const defaultEquations =
    entity.entity.type === "CHARACTER" ? DEFAULT_CHARACTER_EQUATIONS : [];

  const equations: Array<[EntityAttribute, string]> = [...defaultEquations];

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
          equations.push([attr, val]);
        } else {
          const reason = `active ${item.name} ${
            val > 0 ? "adds" : "subtracts"
          } ${val} to ${attrShortName(attr)}`;
          alterAttrs(attr, val, reason);
        }
        appendAdjustItem(attr, item);
      });
    }
  });

  // 3. Fetch effects from abilities
  entity.abilities.forEach((ability) => {
    const adjusts =
      ability.uses?.criteria_benefits
        ?.filter(
          (criteria) =>
            criteria.adjust &&
            abilityPassCriteriaCheck(criteria.criteria, ability, null, attrs)
        )
        .map((criteria) => criteria.adjust) ?? [];
    adjusts.push(ability.uses?.adjust);
    adjusts.forEach((adjust) => {
      if (!adjust) {
        return;
      }
      Object.entries(adjust.attr).forEach(([attrIn, val]) => {
        const attr = attrIn as EntityAttribute;
        if (typeof val === "string") {
          equations.push([attr, val]);
        } else {
          const reason = `${ability.name} ${
            val > 0 ? "adds" : "subtracts"
          } ${val} to ${attrShortName(attr)}`;
          alterAttrs(attr, val, reason);
        }
      });
    });
  });

  // 4. Apply pending equations
  equations.forEach(([attr, equation]) => {
    const parsed = solveEquation(equation, attrs);
    if (parsed !== undefined) {
      const attrMap = attrs[attr];
      const reason = `Set ${attrShortName(attr)} to "${equation}" -> ${parsed}`;
      if (attrMap) {
        // replace value instead of adjusting it
        attrMap.val = parsed;
        if (attrMap.reason) {
          attrMap.reason.push(reason);
        }
      } else {
        alterAttrs(attr, parsed, reason);
      }
    }
  });

  // 5. Enforce zero minimums
  Object.entries(attrs).forEach(([attr, map]) => {
    if (MIN_ZEROS.has(attr) && typeof map.val === "number" && map.val < 0) {
      map.val = 0;
    }
  });

  // console.log(attrs);

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

const attrsRegexStr = `\\b${validAttributes.join("|")}\\b`;
const attrsRegex = new RegExp(attrsRegexStr, "g");

export const solveEquation = (
  equation: string,
  attrs: UpdatedEntityAttributes
): number | undefined => {
  let ceilResult = false;
  const cleanedEquation = equation.replaceAll(attrsRegex, (match) => {
    const attr = match as EntityAttribute;
    // L always rounds up, everything else always floors
    if (attr === "L") {
      ceilResult = true;
    }
    const entityAttr = attrs[attr];
    if (entityAttr) {
      return entityAttr.val.toString();
    }
    const defaultAttr = DEFAULT_ATTRS_MAP[attr];
    if (defaultAttr) {
      return defaultAttr.val.toString();
    }
    return "0";
  });
  // ensure all variables have been removed from the equation before attempting to solve it
  if (/^(?:[\d+\-*/()^ ]|Mod)+$/.test(cleanedEquation)) {
    try {
      const evaluated = mexp.eval(cleanedEquation);
      const floatVal = parseFloat(evaluated);
      if (isNaN(floatVal)) {
        console.warn(
          `equation did not successfully solve: ${equation} -> ${cleanedEquation} -> ${evaluated}`
        );
        return undefined;
      }
      if (ceilResult) {
        return Math.ceil(floatVal);
      }
      return Math.floor(floatVal);
    } catch {
      console.warn(
        `solving equation failed: ${equation} -> ${cleanedEquation}`
      );
    }
  }
  return undefined;
};

export const additionalCombatStatsAttrs = (
  entity: CollectedEntity
): EntityAttribute[] => {
  const attrs = new Set<EntityAttribute>();
  entity.abilities.forEach((ability) => {
    if (ability.uses?.expose_combat_stats) {
      ability.uses.expose_combat_stats.forEach((attr) => attrs.add(attr));
    }
  });
  return Array.from(attrs);
};
