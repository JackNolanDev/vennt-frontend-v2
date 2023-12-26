import isEqual from "lodash.isequal";
import {
  abilityFieldsNameValidator,
  abilityPassCriteriaCheck,
  solveEquation,
  titleText,
  type AbilityCostMap,
  type CharacterGift,
  type CollectedEntity,
  type EntityAbility,
  type EntityAbilityFields,
  type EntityAttribute,
  type FullEntityAbility,
  type PathsAndAbilities,
  type ComputedAttributes,
} from "vennt-library";
import { defaultAbilitySort } from "./abilitySortUtils";

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
  gift?: CharacterGift,
): boolean => {
  return Boolean(
    gift && gift !== "None" && ability.custom_fields?.expedited?.includes(gift),
  );
};

const abilityUsesCostAdjust = (
  cost: number,
  ability: EntityAbility,
  entity: CollectedEntity,
  attrs: ComputedAttributes,
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
        usesAbility.uses?.criteria_benefits,
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
              attrs,
            ),
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
  attrs?: ComputedAttributes,
  entity?: CollectedEntity,
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
export const abilityUsedStatsWithActions = [
  "hp",
  "mp",
  "vim",
  "hero",
  "actions",
  "reactions",
] as const;

export const abilityUseAdjustments = (
  ability: EntityAbility,
  attrs: ComputedAttributes,
  additionalAdjustments?: Record<EntityAttribute, number>,
  optionalHealIdx?: number,
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
    cost?: boolean,
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
      },
    );
  }

  return adjustMap;
};

export const canAffordAdjustments = (
  adjustments: Record<EntityAttribute, number>,
  attrs: ComputedAttributes,
  in_combat?: boolean,
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
  attrs: ComputedAttributes,
  includeActions?: boolean,
): boolean => {
  if (!abilityUsable(ability)) {
    return false;
  }
  const costMap: AbilityCostMap = { ...ability.custom_fields?.cost };
  return (
    includeActions ? abilityUsedStatsWithActions : abilityUsedStats
  ).every((attr) => {
    const statCurrent = attrs[attr];
    if (statCurrent) {
      const statCost = costMap[attr];
      return !statCost || statCost <= statCurrent.val;
    }
    return true;
  });
};

export function sortAbilities(
  abilities: FullEntityAbility[],
): FullEntityAbility[] {
  const paths = sortPaths(abilities);
  const abilitiesCopy = abilities.filter(
    (ability) => ability !== undefined && ability.name,
  );
  return abilitiesCopy.sort(defaultAbilitySort(paths));
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
        pathCostMap[ability.custom_fields.path],
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
  (field) => !["keys", "times_taken", "stars", "highlight"].includes(field),
);

const diffExistsBetweenAbilityFields = (
  a: EntityAbility,
  b: EntityAbility,
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
  paths: PathsAndAbilities,
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

const abilityCostDisplay = (
  costType: string,
  amount: number | boolean,
): string => {
  if (typeof amount === "number") {
    if (costType === "actions") {
      return amount > 1 ? "Actions" : "Action";
    }
    if (costType === "reactions") {
      return amount > 1 ? "Reactions" : "Reaction";
    }
  }
  return costType.length <= 2 ? costType.toUpperCase() : titleText(costType);
};

export const generateAbilityActivation = (cost: AbilityCostMap): string => {
  let activation = "";
  Object.entries(cost).forEach(([costType, amount]) => {
    const titleCostType = abilityCostDisplay(costType, amount);
    let convertedAmount: number | boolean | string = amount;
    if (convertedAmount === 0 && ["actions", "reactions"].includes(costType)) {
      convertedAmount = "Free";
    }
    const costExtension =
      typeof convertedAmount === "boolean"
        ? titleCostType
        : `${convertedAmount} ${titleCostType}`;
    activation = activation ? `${activation}, ${costExtension}` : costExtension;
  });
  return activation;
};
