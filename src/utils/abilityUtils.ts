import isEqual from "lodash.isequal";
import {
  abilityFieldsNameValidator,
  type AbilityCostMap,
  type AbilityCostMapNumber,
  type CharacterGift,
  type CollectedEntity,
  type EntityAbility,
  type EntityAbilityFields,
  type EntityAttribute,
  type FullEntityAbility,
  type PathsAndAbilities,
  type UpdatedEntityAttributes,
} from "vennt-library";
import { titleText } from "./textUtils";
import { abilityPassCriteriaCheck } from "./criteriaUtils";
import { solveEquation } from "./attributeUtils";

const freeAbilities = new Set(["Alchemist's Training"]); // Alchemist's Training is free with Tinker's Training

export const defaultXPCost = (ability: EntityAbility): number => {
  if (
    !ability.custom_fields?.purchase ||
    ability.custom_fields.purchase.includes("sp") ||
    freeAbilities.has(ability.name)
  ) {
    return 0;
  }
  const cost = parseInt(ability.custom_fields.purchase);
  return isNaN(cost) ? 0 : cost;
};

const giftInAbilityExpedited = (
  ability: EntityAbility,
  gift?: CharacterGift
): boolean => {
  return Boolean(
    gift && gift !== "None" && ability.custom_fields?.expedited?.includes(gift)
  );
};

const abilityUsesCostAdjust = (
  cost: number,
  ability: EntityAbility,
  entity: CollectedEntity,
  attrs: UpdatedEntityAttributes
): number => {
  const adjustTotal = (adjustCost: number | string) => {
    if (typeof adjustCost === "number") {
      cost = Math.max(cost + adjustCost, 0);
    } else {
      cost = Math.max(solveEquation(adjustCost, attrs) ?? cost, 0);
    }
  };

  entity.abilities
    .filter(
      (usesAbility) =>
        usesAbility.uses?.adjust_ability_cost ||
        usesAbility.uses?.criteria_benefits
    )
    .forEach((usesAbility) => {
      if (usesAbility.uses?.adjust_ability_cost) {
        adjustTotal(usesAbility.uses.adjust_ability_cost.adjust_cost);
      }
      if (usesAbility.uses?.criteria_benefits) {
        const passedCriteria = usesAbility.uses.criteria_benefits.filter(
          (criteria) =>
            criteria.adjust_ability_cost &&
            abilityPassCriteriaCheck(
              criteria.criteria,
              usesAbility,
              ability,
              attrs
            )
        );
        passedCriteria.forEach((criteria) => {
          if (criteria.adjust_ability_cost) {
            adjustTotal(criteria.adjust_ability_cost.adjust_cost);
          }
        });
      }
    });
  return cost;
};

export const actualXPCost = (
  ability: EntityAbility,
  attrs?: UpdatedEntityAttributes,
  entity?: CollectedEntity
): number => {
  let cost = defaultXPCost(ability);
  if (!entity) {
    return cost;
  }
  if (
    giftInAbilityExpedited(ability, entity.entity.other_fields.gift) ||
    giftInAbilityExpedited(ability, entity.entity.other_fields.second_gift)
  ) {
    cost = cost / 2;
  }
  if (!attrs) {
    return cost;
  }
  const singleAbilityCost = abilityUsesCostAdjust(cost, ability, entity, attrs);
  return singleAbilityCost * (ability.custom_fields?.times_taken ?? 1);
};

export const abilityUsedStats = ["hp", "mp", "vim", "hero"] as const;

export const abilityUseAdjustments = (
  ability: EntityAbility,
  attrs: UpdatedEntityAttributes,
  additionalAdjustments?: Record<EntityAttribute, number>,
  optionalHealIdx?: number
): Record<EntityAttribute, number> => {
  const adjustMap: Record<EntityAttribute, number> = {
    ...additionalAdjustments,
  };

  const insertNumberIntoMap = (attr: EntityAttribute, val: number) => {
    if (adjustMap[attr]) {
      adjustMap[attr] = adjustMap[attr] + val;
    } else {
      adjustMap[attr] = val;
    }
  };

  const insertVal = (
    attr: EntityAttribute,
    val: number | string | boolean,
    cost?: boolean
  ) => {
    if (typeof val === "number") {
      insertNumberIntoMap(attr, cost ? -val : val);
    } else if (typeof val === "string") {
      const solved = solveEquation(val, attrs);
      if (solved) {
        insertNumberIntoMap(attr, cost ? -solved : solved);
      }
    }
  };

  if (ability.custom_fields?.cost) {
    Object.entries(ability.custom_fields.cost).forEach(([attr, val]) => {
      insertVal(attr, val, true);
    });
  }
  if (ability.uses?.heal?.attr) {
    Object.entries(ability.uses.heal.attr).forEach(([attr, val]) => {
      insertVal(attr, val);
    });
  }
  if (
    typeof optionalHealIdx === "number" &&
    ability.uses?.optional_heal &&
    ability.uses.optional_heal[optionalHealIdx]
  ) {
    Object.entries(ability.uses.optional_heal[optionalHealIdx].attr).forEach(
      ([attr, val]) => {
        insertVal(attr, val);
      }
    );
  }

  return adjustMap;
};

export const canAffordAdjustments = (
  adjustments: Record<EntityAttribute, number>,
  attrs: UpdatedEntityAttributes,
  in_combat?: boolean
): boolean => {
  return Object.entries(adjustments).every(([attr, adjust]) => {
    if (!in_combat && ["actions", "reactions"].includes(attr)) {
      return true;
    }
    const attrMap = attrs[attr];
    if (!attrMap) {
      return adjust > 0;
    }
    return attrMap.val + adjust >= 0;
  });
};

export const abilityUsable = (ability: EntityAbility): boolean => {
  return !(
    ability.active ||
    ((ability.custom_fields?.cost?.passive ||
      ability.custom_fields?.activation?.toLowerCase().includes("passive")) &&
      !(ability.uses?.heal || ability.uses?.optional_heal))
  );
};

export const canUseAbility = (
  ability: EntityAbility,
  attrs: UpdatedEntityAttributes,
  additionalCost?: Record<EntityAttribute, number>
): boolean => {
  if (!abilityUsable(ability)) {
    return false;
  }
  const costMap: AbilityCostMap = { ...ability.custom_fields?.cost };
  if (additionalCost) {
    Object.entries(additionalCost).forEach(([attrIn, cost]) => {
      const attr = attrIn as keyof AbilityCostMapNumber;
      const currentCost = costMap[attr];
      if (currentCost) {
        costMap[attr] = cost + currentCost;
      } else {
        costMap[attr] = cost;
      }
    });
  }
  return abilityUsedStats.every((attr) => {
    const statCurrent = attrs[attr];
    if (statCurrent) {
      const statCost = costMap[attr];
      return !statCost || statCost <= statCurrent.val;
    }
    return true;
  });
};

export function sortAbilities(
  abilities: FullEntityAbility[]
): FullEntityAbility[] {
  const paths = sortPaths(abilities);
  const abilitiesCopy = abilities.filter(
    (ability) => ability !== undefined && ability.name
  );
  return abilitiesCopy.sort((a1, a2) => {
    // 0. put abilities with stars at the top of the list
    const a1Stars = a1.custom_fields?.stars ?? 0;
    const a2Stars = a2.custom_fields?.stars ?? 0;
    if ((a1Stars > 0 || a2Stars > 0) && a1Stars !== a2Stars) {
      return a2Stars - a1Stars;
    }
    // 1. put Passive abilities at the end of the list
    const a1Passive =
      a1.custom_fields?.cost?.passive ||
      a1.custom_fields?.activation?.toLowerCase() === "passive";
    const a2Passive =
      a2.custom_fields?.cost?.passive ||
      a2.custom_fields?.activation?.toLowerCase() === "passive";
    if (!a1Passive && a2Passive) {
      return -1;
    } else if (a1Passive && !a2Passive) {
      return 1;
    }
    // 2. put abilities which use SP instead of XP at the end of the list when passive
    if (
      a1Passive &&
      a1.custom_fields?.purchase &&
      a2Passive &&
      a2.custom_fields?.purchase
    ) {
      const a1SP = a1.custom_fields.purchase.includes("sp");
      const a2SP = a2.custom_fields.purchase.includes("sp");
      if (!a1SP && a2SP) {
        return -1;
      } else if (a1SP && !a2SP) {
        return 1;
      }
    }
    // 3. sort by path gathering
    if (
      a1.custom_fields?.path &&
      a2.custom_fields?.path &&
      a1.custom_fields.path !== a2.custom_fields.path
    ) {
      const pathIdx = (given: string) =>
        paths.findIndex((path) => path === given);
      return pathIdx(a1.custom_fields.path) - pathIdx(a2.custom_fields.path);
    }
    // 4. sort by XP price otherwise (for now at least)
    const costInt = (purchase: string | undefined) => {
      if (purchase === undefined) {
        return 0;
      }
      const cost = parseInt(purchase);
      if (isNaN(cost)) {
        return 0;
      }
      return cost;
    };
    const diff =
      costInt(a1.custom_fields?.purchase) - costInt(a2.custom_fields?.purchase);
    if (diff !== 0) {
      return diff;
    }
    return a1.name.localeCompare(a2.name);
  });
}

// returns a list of paths from the given abilities sorted by paths which contain the least expensive abilities
// eventually we could probably sort based on the req tree which could be parsed in the json object with all abilities
export const sortPaths = (abilities: EntityAbility[]): string[] => {
  const pathCostMap: { [path: string]: number } = {};
  abilities.forEach((ability) => {
    let cost = 5000; // arbitrary amount that costs a lot
    if (ability.custom_fields?.purchase) {
      const purchaseCost = parseInt(ability.custom_fields.purchase);
      if (isNaN(purchaseCost)) {
        cost = purchaseCost;
      }
    }
    if (!ability.name || !ability.custom_fields?.path) {
      return;
    }
    if (ability.custom_fields.path in pathCostMap) {
      pathCostMap[ability.custom_fields.path] = Math.min(
        cost,
        pathCostMap[ability.custom_fields.path]
      );
    } else {
      pathCostMap[ability.custom_fields.path] = cost;
    }
  });
  const paths = Object.keys(pathCostMap);
  paths.sort((p1, p2) => pathCostMap[p1] - pathCostMap[p2]);
  return paths;
};

const abilityUpdatableFields = (
  Object.keys(abilityFieldsNameValidator.Values) as EntityAbilityFields[]
).filter(
  (field) => !["keys", "times_taken", "stars", "highlight"].includes(field)
);

const diffExistsBetweenAbilityFields = (
  a: EntityAbility,
  b: EntityAbility
): boolean => {
  if (a.name !== b.name) {
    return true;
  }
  if (
    abilityUpdatableFields.some((field) => {
      if (!a.custom_fields && !b.custom_fields) {
        return false;
      }
      const aField = a.custom_fields && a.custom_fields[field];
      const bField = b.custom_fields && b.custom_fields[field];
      return !isEqual(aField, bField);
    })
  ) {
    return true;
  }
  return Boolean((a.uses || b.uses) && !isEqual(a.uses, b.uses));
};

export const findNewAbilityVersion = (
  ability: EntityAbility,
  paths: PathsAndAbilities
): EntityAbility | undefined => {
  const found = paths.abilities.find((search) => search.name === ability.name);
  // console.log(found);
  if (!found) {
    return undefined;
  }
  if (diffExistsBetweenAbilityFields(ability, found)) {
    return {
      ...ability,
      effect: found.effect,
      uses: found.uses,
      custom_fields: {
        ...found.custom_fields,
        keys: ability.custom_fields?.keys,
        times_taken: ability.custom_fields?.times_taken,
        stars: ability.custom_fields?.stars,
        highlight: ability.custom_fields?.highlight,
      },
    };
  }
  return undefined;
};

export const generateAbilityActivation = (cost: AbilityCostMap): string => {
  let activation = "";
  Object.entries(cost).forEach(([costType, amount]) => {
    const titleCostType = titleText(costType);
    const costExtension =
      typeof amount === "boolean"
        ? titleCostType
        : `${amount} ${titleCostType}`;
    activation = activation ? `${activation}, ${costExtension}` : costExtension;
  });
  return activation;
};

export const abilityExtendEntityAttributes = (
  ability: EntityAbility,
  attrs: UpdatedEntityAttributes
): UpdatedEntityAttributes => {
  const keyStorage = ability.custom_fields?.keys;
  if (!keyStorage) {
    return attrs;
  }

  return Object.entries(keyStorage).reduce<UpdatedEntityAttributes>(
    (acc, [key, val]) => {
      const parsed = solveEquation(val, acc);
      if (parsed) {
        acc[key] = { val: parsed };
      }
      return acc;
    },
    { ...attrs }
  );
};
