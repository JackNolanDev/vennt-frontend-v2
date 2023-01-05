import type { CollectedEntity, EntityAbility } from "./backendTypes";

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
