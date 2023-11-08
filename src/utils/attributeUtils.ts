import { useEntityStore } from "@/stores/entity";
import {
  validAttributes,
  type CollectedEntity,
  type EntityAttribute,
  type FullCollectedEntity,
  type PartialEntityAttributes,
  type UpdatedEntityAttributes,
  type UpdateEntityAttributes,
  type ComputedAttributes,
  MIN_ZEROS,
  getMaxAttr,
} from "vennt-library";

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
  adjust: number,
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
  entityAttrs: UpdatedEntityAttributes | ComputedAttributes,
  adjustAttrs: PartialEntityAttributes,
  enforceMaximums = false,
  propagateChanges = true,
  inCombat = false,
): PartialEntityAttributes => {
  const attrs: PartialEntityAttributes = {};
  const defaultVal = (
    attr: EntityAttribute,
    fetchAdjustedVal = false,
  ): number => {
    if (fetchAdjustedVal) {
      return entityAttrs[attr]?.val ?? 0;
    }
    return entityAttrs[attr]?.base ?? 0;
  };
  const currentVal = (
    attr: EntityAttribute,
    fetchAdjustedVal = false,
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
  if (propagateChanges && inCombat) {
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
  entityAttrs: UpdatedEntityAttributes | ComputedAttributes,
  adjustAttrs: PartialEntityAttributes,
  options?: {
    msg?: string;
    propagateChanges?: boolean;
    enforceMaximums?: boolean;
    src?: string;
  },
): Promise<boolean> => {
  const { msg, propagateChanges, enforceMaximums, src } = {
    propagateChanges: true,
    enforceMaximums: false,
    ...options,
  };
  const entityStore = useEntityStore();
  const attrs = adjustAttrsObject(
    entityAttrs,
    adjustAttrs,
    enforceMaximums,
    entityStore.inCombat,
  );

  if (Object.keys(attrs).length === 0) {
    return false;
  }

  if (propagateChanges) {
    if (attrs.xp) {
      const levelDiff = calcLevelDiffEntity(attrs.xp, entity);
      if (levelDiff > 0) {
        entityStore.levelsToProcess = levelDiff;
      }
    }

    if (
      src &&
      attrs.recovery_shock &&
      attrs.recovery_shock > (entity.entity.attributes.recovery_shock ?? 0)
    ) {
      if (entityStore.recoveryShockSrc) {
        entityStore.recoveryShockSrc.push(src);
      } else {
        entityStore.recoveryShockSrc = [src];
      }
    }
  }
  const request: UpdateEntityAttributes = {
    attributes: attrs,
    ...(msg && { message: msg }),
  };
  await entityStore.updateEntityAttributes(entity.entity.id, request);
  return true;
};

export const additionalCombatStatsAttrs = (
  entity: CollectedEntity,
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
