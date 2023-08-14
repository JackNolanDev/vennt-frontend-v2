import { useEntityStore } from "@/stores/entity";
import mexp from "math-expression-evaluator";
import {
  ATTRIBUTES_SET,
  validAttributes,
  type CollectedEntity,
  type DiceSettings,
  type EntityAbility,
  type EntityAttribute,
  type EntityItem,
  type FullCollectedEntity,
  type PartialEntityAttributes,
  type UpdatedEntityAttributes,
  type UpdateEntityAttributes,
  type UseAttrMap,
  type Entity,
} from "./backendTypes";
import { titleText } from "./textUtils";
import { abilityPassCriteriaCheck } from "./criteriaUtils";
import { DEFAULT_ATTRS_MAP, DEFAULT_CHARACTER_EQUATIONS } from "./venntConfig";
import { combineDiceSettings } from "./diceUtils";

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
  "alerts",
  "max_alerts",
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
]);

const attrMaxMap: { [attr in EntityAttribute]?: EntityAttribute } = {
  hp: "max_hp",
  mp: "max_mp",
  vim: "max_vim",
  hero: "max_hero",
  trii: "max_trii",
  alerts: "max_alerts",
};

const attrBaseMap: { [attr in EntityAttribute]?: EntityAttribute } = {
  max_hp: "hp",
  max_mp: "mp",
  max_vim: "vim",
  max_hero: "hero",
  max_trii: "trii",
  max_alerts: "alerts",
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
  const nameMap: Record<EntityAttribute, string> = {
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
  const nameMap: Record<EntityAttribute, string> = {
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
  if (/^[a-z]{3}_dmg$/u.exec(attr)) {
    return `${attrShortName(attr.substring(0, 3))} Damage`;
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
  entity: Entity,
  entityAttrs: UpdatedEntityAttributes,
  adjustAttrs: PartialEntityAttributes,
  enforceMaximums = false,
  propagateChanges = true
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
    const attrVal = currentVal(attr);
    const newVal = attrVal + adjustment;
    attrs[attr] = newVal;

    // Special case logic
    if (propagateChanges) {
      const bleedingVal = currentVal("bleeding");
      if (attr === "hp" && adjustment > 0 && bleedingVal > 0) {
        const bleedingDiff = bleedingVal - adjustment;
        if (bleedingDiff >= 0) {
          attrs.bleeding = bleedingDiff;
          attrs.hp = attrVal;
        } else {
          attrs.bleeding = 0;
          attrs.hp = newVal - bleedingVal;
        }
      }
    }
  });

  // 2. enforce zero minimums
  Object.entries(attrs).forEach(([attr, val]) => {
    if (MIN_ZEROS.has(attr) && val < 0) {
      attrs[attr] = 0;
    }
  });

  // 3. enforce maximums
  if (enforceMaximums) {
    Object.entries(attrs).forEach(([attr, val]) => {
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

  // 4. only allow changes to actions / reactions when in combat
  if (propagateChanges && !entity.other_fields.in_combat) {
    if (attrs.actions) {
      attrs.actions = 0;
    }
    if (attrs.reactions) {
      attrs.reactions = 0;
    }
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
  const attrs = adjustAttrsObject(
    entity.entity,
    entityAttrs,
    adjustAttrs,
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
  const request: UpdateEntityAttributes = {
    attributes: attrs,
    ...(msg && { message: msg }),
  };
  await entityStore.updateEntityAttributes(entity.entity.id, request);
  return true;
};

// TODO: Need to add a way to change the order adjustments / equations / criteria checks are completed
// E.g. if I want to check that the entity is at full health, I would like to use a criteria check
// but this is impossible since max_hp is a calculated attribute

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
      } else {
        attrMap.reason = [reason];
      }
    }
  };

  const ensureDefaultAttrVal = (attr: EntityAttribute) => {
    const attrCheck = attrs[attr];
    if (attrCheck === undefined) {
      attrs[attr] = { val: 0 };
    }
  };

  const appendAdjustItem = (attr: EntityAttribute, item: EntityItem) => {
    ensureDefaultAttrVal(attr);
    const attrMap = attrs[attr]!;
    if (!attrMap.items) {
      attrMap.items = [item];
    } else {
      attrMap.items.push(item);
    }
  };

  const appendAdjustAbility = (
    attr: EntityAttribute,
    ability: EntityAbility
  ) => {
    ensureDefaultAttrVal(attr);
    const attrMap = attrs[attr]!;
    if (!attrMap.abilities) {
      attrMap.abilities = [ability];
    } else {
      attrMap.abilities.push(ability);
    }
  };

  const appendDiceAdjust = (attr: EntityAttribute, dice: DiceSettings) => {
    ensureDefaultAttrVal(attr);
    const attrMap = attrs[attr]!;
    if (!attrMap.dice) {
      attrMap.dice = dice;
    } else {
      attrMap.dice = combineDiceSettings(attrMap.dice, dice, attrs);
    }
  };

  const defaultEquations =
    entity.entity.type === "CHARACTER" ? DEFAULT_CHARACTER_EQUATIONS : [];

  const equations: Array<[EntityAttribute, string]> = [...defaultEquations];

  // 2. Fetch effects from items
  entity.items.forEach((item) => {
    if (
      item.uses?.adjust &&
      (item.active || item.type === "equipment") &&
      !item.custom_fields?.in_storage
    ) {
      if (item.uses.adjust.attr) {
        Object.entries(item.uses.adjust.attr).forEach(([attr, val]) => {
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
      if (item.uses.adjust.dice) {
        Object.entries(item.uses.adjust.dice).forEach(([attr, dice]) => {
          appendDiceAdjust(attr, dice);
        });
      }
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
      if (adjust && (adjust.time === "permanent" || ability.active)) {
        if (adjust?.attr) {
          Object.entries(adjust.attr).forEach(([attr, val]) => {
            if (typeof val === "string") {
              equations.push([attr, val]);
            } else {
              const reason = `${ability.name} ${
                val > 0 ? "adds" : "subtracts"
              } ${val} to ${attrShortName(attr)}`;
              alterAttrs(attr, val, reason);
            }
            appendAdjustAbility(attr, ability);
          });
        }
        if (adjust?.dice) {
          Object.entries(adjust.dice).forEach(([attr, dice]) => {
            appendDiceAdjust(attr, dice);
          });
        }
      }
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
    if (map && MIN_ZEROS.has(attr) && map.val < 0) {
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
  Object.entries(usesMap).forEach(([attr, val]) => {
    if (typeof val === "string") {
      const solved = solveEquation(val, attrs);
      if (solved) {
        cleaned[attr] = solved;
      }
    } else {
      cleaned[attr] = val;
    }
  });
  return cleaned;
};

export const attrsRegexStr = (attrs: UpdatedEntityAttributes): string => {
  const attributes = Array.from(
    new Set([...validAttributes, ...Object.keys(attrs)])
  );
  return attributes.map((attr) => `\\b${attr}\\b`).join("|");
};

const attrsRegex = (attrs: UpdatedEntityAttributes): RegExp =>
  new RegExp(attrsRegexStr(attrs), "g");

const numToStr = (num: number): string => {
  const numStr = num.toString();
  if (num < 0) {
    return `(${numStr})`;
  }
  return numStr;
};

export const replaceVariablesInEquation = (
  equation: string,
  attrs: UpdatedEntityAttributes
): { cleanedEquation: string; details: { ceilResult: boolean } } => {
  let ceilResult = false;
  const cleanedEquation = equation.replaceAll(attrsRegex(attrs), (match) => {
    const attr = match as EntityAttribute;
    // L always rounds up, everything else always floors
    if (attr === "L") {
      ceilResult = true;
    }
    const entityAttr = attrs[attr];
    if (entityAttr) {
      return numToStr(entityAttr.val);
    }
    const defaultAttr = DEFAULT_ATTRS_MAP[attr];
    if (defaultAttr) {
      return numToStr(defaultAttr.val);
    }
    return "0";
  });
  return { cleanedEquation, details: { ceilResult } };
};

export const solveEquation = (
  equation: string,
  attrs: UpdatedEntityAttributes
): number | undefined => {
  const {
    cleanedEquation,
    details: { ceilResult },
  } = replaceVariablesInEquation(equation, attrs);
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
  // console.log(`Couldn't solve equation: ${cleanedEquation}`);
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

export const isCustomAttr = (attr: EntityAttribute): boolean => {
  return !validAttributes.includes(attr);
};
