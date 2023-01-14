import type {
  CollectedEntity,
  EntityAbility,
  FullEntityAbility,
} from "./backendTypes";

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

export const actualXPCost = (
  ability: EntityAbility,
  entity?: CollectedEntity
): number => {
  let cost = defaultXPCost(ability);
  if (
    entity?.entity.other_fields.gift &&
    entity.entity.other_fields.gift !== "None" &&
    ability.custom_fields?.expedited?.includes(entity.entity.other_fields.gift)
  ) {
    cost = cost / 2;
  }
  return cost;
};

export const canUseAbility = (ability: EntityAbility): boolean => {
  if (
    ability.active ||
    ability.custom_fields?.activation?.toLowerCase().includes("passive")
  ) {
    return false;
  }
  return true;
};

export function sortAbilities(
  abilities: FullEntityAbility[]
): FullEntityAbility[] {
  const paths = sortPaths(abilities);
  const abilitiesCopy = abilities.filter(
    (ability) => ability !== undefined && ability.name
  );
  return abilitiesCopy.sort((a1, a2) => {
    // 1. put Passive abilities at the end of the list
    /*
    const a1Passive = a1.cost && "Passive" in a1.cost && a1.cost.Passive;
    const a2Passive = a2.cost && "Passive" in a2.cost && a2.cost.Passive;
    if (!a1Passive && a2Passive) {
      return -1;
    } else if (a1Passive && !a2Passive) {
      return 1;
    }
    // 2. put abilities which use SP instead of XP at the end of the list when passive
    if (a1Passive && a1.purchase && a2Passive && a2.purchase) {
      const a1SP = a1.purchase.includes("sp");
      const a2SP = a2.purchase.includes("sp");
      if (!a1SP && a2SP) {
        return -1;
      } else if (a1SP && !a2SP) {
        return 1;
      }
    }
    */
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
    return (
      costInt(a1.custom_fields?.purchase) - costInt(a2.custom_fields?.purchase)
    );
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
