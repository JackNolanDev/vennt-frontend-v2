import { z } from "zod";
import { solveEquation } from "../attributeUtils";
import {
  baseAttributeFieldValidator,
  type BaseEntityAttribute,
  type EntityAttribute,
  type UncompleteEntityAbility,
  type UpdatedEntityAttributes,
  type UsesMap,
} from "../backendTypes";
import { cogAbilityMap, type CogAbility } from "./createCogAbilityOptions";
import { cogTypeOptionsInfo } from "./createCogTypeOptions";

export const COG_ATTRIBUTE_LEVELS = [
  "weak",
  "moderate",
  "strong",
  "exceptional",
] as const;

export const cogAttributeLevelValidator = z.enum(COG_ATTRIBUTE_LEVELS);

export const cogCreateOptionsValidator = z.object({
  name: z.string(),
  level: z.string().or(z.number()),
  type: z.string(),
  desc: z.string(),
  attrOverrides: z.record(
    baseAttributeFieldValidator,
    cogAttributeLevelValidator
  ),
  abilitySelection: z.record(z.string(), z.string()),
  variableAbilityCost: z.record(z.string(), z.string().or(z.number())),
});

export type CogCreateOptions = z.infer<typeof cogCreateOptionsValidator>;
export type CogAttributeLevel = z.infer<typeof cogAttributeLevelValidator>;

export const LStat = (level: string | number) => {
  if (typeof level === "string") {
    const val = parseInt(level);
    return isNaN(val) ? 0 : val;
  }
  return Math.floor(level);
};

const LStatForAttr = (
  options: CogCreateOptions,
  attr: EntityAttribute
): number => {
  let baseLStat = LStat(options.level);
  Object.values(options.abilitySelection).forEach((choice) => {
    const ability = cogAbilityMap[choice];
    if (!ability?.creationEffect?.attrLevelAdjust) {
      return;
    }
    const levelAdjust = ability.creationEffect.attrLevelAdjust[attr];
    if (!levelAdjust) {
      return;
    }
    if (typeof levelAdjust === "number") {
      baseLStat += levelAdjust;
    } else {
      const equationResult = solveEquation(levelAdjust, {
        L: { val: baseLStat },
      });
      if (equationResult) {
        baseLStat = equationResult;
      }
    }
  });
  return baseLStat;
};

const cogAttributeLevelFunctions: Record<
  CogAttributeLevel,
  (L: number) => number
> = {
  weak: (L: number): number => {
    return Math.ceil(L / 5 - 3);
  },
  moderate: (L: number): number => {
    return Math.ceil(L / 3);
  },
  strong: (L: number): number => {
    return Math.ceil(L / 2);
  },
  exceptional: (L: number): number => {
    return Math.ceil((3 * L) / 4);
  },
};

export const cogBaseAttribute = (
  options: CogCreateOptions,
  attr: BaseEntityAttribute
): number => {
  const L = LStatForAttr(options, attr);
  let attrLevel: CogAttributeLevel | undefined = options.attrOverrides[attr];
  if (!attrLevel) {
    const cogType = cogTypeOptionsInfo[options.type];
    if (cogType) {
      attrLevel = cogType.attrs[attr];
    }
  }
  if (!attrLevel) {
    attrLevel = "moderate";
  }
  const levelFunction = cogAttributeLevelFunctions[attrLevel];
  return levelFunction(L);
};

export const cogInit = (options: CogCreateOptions): number => {
  const L = LStatForAttr(options, "init");
  if (L <= 14) {
    return L + 11;
  }
  return L * 2;
};

export const cogHP = (options: CogCreateOptions): number => {
  const L = LStatForAttr(options, "hp");
  return Math.max(L * 5, 1);
};

export const cogAcc = (options: CogCreateOptions): number => {
  const L = LStatForAttr(options, "acc");
  if (L <= 14) {
    let acc = Math.max((L + 1) * 5);
    if (L >= 6) {
      acc += 5;
    }
    if (L >= 12) {
      acc += 5;
    }
    return acc;
  }
  return L * 6;
};

export const cogVim = (options: CogCreateOptions): number => {
  const L = LStatForAttr(options, "vim");
  if (L <= 14) {
    let vim = Math.max((L + 1) * 5);
    if (L >= 3) {
      vim += 10;
    }
    if (L >= 6) {
      vim += 5;
    }
    if (L >= 9) {
      vim += 5;
    }
    if (L >= 12) {
      vim += 5;
    }
    return vim;
  }
  return L * 8;
};

export const cogMP = (options: CogCreateOptions): number => {
  const L = LStatForAttr(options, "mp");
  return Math.max(L, 0);
};

export const cogSpeed = (options: CogCreateOptions): number => {
  const L = LStatForAttr(options, "speed");
  if (L <= 1) {
    return Math.max(L + 3, 0);
  } else if (L <= 14) {
    return Math.floor((L + 8) / 2);
  }
  return L;
};

export const totalAP = (options: CogCreateOptions): number => {
  return LStat(options.level) * 2;
};

export const spentAP = (
  cogAbilities: CogAbility[],
  options: CogCreateOptions
): number => {
  return cogAbilities
    .map((ability) => cogAbilityCost(ability, options))
    .reduce((acc, cost) => acc + cost, 0);
};

export const cogAbilityCost = (
  ability: CogAbility,
  options: CogCreateOptions
): number => {
  if (typeof ability.cost === "number") {
    return ability.cost;
  }
  const attrMap: UpdatedEntityAttributes = { L: { val: LStat(options.level) } };
  const variableCost = options.variableAbilityCost[ability.name];
  if (typeof variableCost === "number") {
    attrMap.X = { val: variableCost };
  }
  return solveEquation(ability.cost, attrMap) ?? 0;
};

export const cogAbilities = (options: CogCreateOptions): CogAbility[] =>
  keysToCogAbilities(Object.values(options.abilitySelection));

export const keysToCogAbilities = (keys: string[]): CogAbility[] =>
  keys.map((selected) => cogAbilityMap[selected]).filter(Boolean);

export const entityAbilities = (
  cogAbilities: CogAbility[],
  options: CogCreateOptions
): UncompleteEntityAbility[] => {
  return cogAbilities.map((cogAbility) => {
    const cost = cogAbility.useCost ?? { passive: true };
    let activation = "";
    Object.entries(cost).forEach(([costType, amount]) => {
      const costExtension =
        typeof amount === "boolean" ? costType : `${amount} ${costType}`;
      activation = activation
        ? `${activation}, ${costExtension}`
        : costExtension;
    });
    const effect = solveEffectTemplates(cogAbility, options);
    const uses = cogAbilityUses(cogAbility, options);
    return {
      name: cogAbility.name,
      custom_fields: {
        cost,
        activation,
      },
      effect,
      uses,
      active: false,
    };
  });
};

const solveEffectTemplates = (
  cogAbility: CogAbility,
  options: CogCreateOptions
): string => {
  const { effect, name } = cogAbility;
  const variableCost = options.variableAbilityCost[name];
  if (variableCost && typeof variableCost === "number") {
    const costMap = { X: { val: variableCost } };
    const templateRegex = /\[\[[^\]]+\]\]/gm;
    return effect.replaceAll(templateRegex, (match) => {
      const equation = match.substring(2, match.length - 2);
      return solveEquation(equation, costMap)?.toString() ?? equation;
    });
  }
  return effect;
};

const cogAbilityUses = (
  cogAbility: CogAbility,
  options: CogCreateOptions
): UsesMap | undefined => {
  const { uses: originalUses, name } = cogAbility;
  // need to make a deep copy so we can modify values without effecting base abilities
  const uses: UsesMap = structuredClone(originalUses);
  if (!uses?.adjust) {
    return uses;
  }
  const variableCost = options.variableAbilityCost[name];
  if (variableCost && typeof variableCost === "number") {
    Object.entries(uses.adjust.attr).forEach(([attr, value]) => {
      if (typeof value === "string") {
        uses.adjust!.attr[attr as EntityAttribute] = value.replaceAll(
          /\bX\b/gm,
          variableCost.toString()
        );
      }
    });
  }
  return uses;
};
