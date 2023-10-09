import {
  DamageType,
  PHYSICAL_SUB_DAMAGES,
  type AttackDetails,
  type EntityAttribute,
  type UpdatedEntityAttributes,
  type AttackResponse,
} from "./backendTypes";

export const handleDamageCalculator = (
  attack: AttackDetails,
  response: AttackResponse,
  attrs: UpdatedEntityAttributes
): {
  adjustAttrs: Record<EntityAttribute, number>;
  reasons: string[];
} => {
  const reasons: string[] = [];

  // 0. exit early if evading attack
  if (response.dodge) {
    reasons.push("evaded attack using Dodge");
    return {
      adjustAttrs: { vim: -Math.floor(attack.accuracy / 10), reactions: -1 },
      reasons,
    };
  }

  // 0.1 Abilities that affect total alerts
  let alerts = response.alerts;

  if (response.inHolyShield) {
    alerts += 1;
    reasons.push(`gained 1 alert from Holy Shield`);
  }

  // 0.2 Handle adjustments to reactions
  let reactions_used = 0;
  if (response.block) {
    reactions_used += 1;
  }

  const adjustAttrs: Record<EntityAttribute, number> = {};

  const addToAttrs = (attr: EntityAttribute, val: number): void => {
    if (val === 0) {
      return;
    }
    if (typeof adjustAttrs[attr] === "number") {
      adjustAttrs[attr] += val;
    } else {
      adjustAttrs[attr] = val;
    }
  };

  for (const detail of attack.damages) {
    let damage = detail.damage;
    let vimCost = 0;

    const vim = attrs.vim?.val ?? 0;

    // 1. Handle damage resistance
    const resistanceAttr = `${detail.type}_damage_resistance`;
    let resistanceVal = attrs[resistanceAttr]?.val;
    if (!resistanceVal && PHYSICAL_SUB_DAMAGES.includes(detail.type)) {
      // Look for default physical damage resistance
      resistanceVal = attrs.physical_damage_resistance?.val;
    }
    if (resistanceVal) {
      if (resistanceVal <= -2) {
        reasons.push(`${detail.type} damage doubled due to damage type`);
        damage = damage * 2;
      } else if (resistanceVal <= -1) {
        reasons.push(
          `${detail.type} damage increased by ${damage / 2} due to ${
            detail.type
          } vulnerability`
        );
        damage = damage + damage / 2;
      } else if (resistanceVal <= 1) {
        reasons.push(
          `${detail.type} damage decreased by ${damage / 2} due to resistance`
        );
        damage = damage / 2;
      } else {
        reasons.push(`${detail.type} damage negated due to invulnerability`);
        damage = 0;
      }
    }

    // 2. glancing blow
    let isGlancingBlow = false;
    if (vim > attack.accuracy) {
      damage /= 2;
      isGlancingBlow = true;
    }

    if (isGlancingBlow && [DamageType.ATTRIBUTE].includes(detail.type)) {
      damage = 0;
      reasons.push(`${detail.type} damage negated due to glancing blow`);
    } else {
      reasons.push(`${detail.type} damage halved due to glancing blow`);
    }

    // 3. Modifiers that apply to "incoming damage"

    if (alerts > 0 && damage > 0) {
      damage = damage >> alerts;
      reasons.push(
        `used ${alerts} alerts to 1/${1 << alerts} ${detail.type} damage`
      );
    }

    // 4. Armor
    if (
      attrs.armor &&
      attrs.armor.val > 0 &&
      damage > 0 &&
      ![
        DamageType.ATTRIBUTE,
        DamageType.BLEED,
        DamageType.BURN,
        DamageType.FALL,
        DamageType.PARALYSIS,
        DamageType.STUN,
      ].includes(detail.type)
    ) {
      let armor = attrs.armor.val;
      let additionalReason = "";

      // Support for Shields
      if (
        response.block &&
        isGlancingBlow &&
        response.hasShieldBlock &&
        attrs.shield &&
        attrs.shield.val > 0
      ) {
        armor += attrs.shield.val;
        additionalReason += ` including ${attrs.shield.val} from Shield Blocking`;

        if (response.hasImprovedShieldBlock && attrs.str) {
          armor += attrs.str.val;
          additionalReason += ` and ${attrs.str.val} from Improved Shield Blocking`;
        }
      }

      armor = Math.min(armor, damage);
      damage -= armor;
      reasons.push(
        `armor reduced ${detail.type} damage by ${armor}${additionalReason}`
      );
    }

    // 5. Modifiers that apply to "incoming damage after Armor reduction"

    if (response.block && damage > 0) {
      if (response.hasEnhancedBlock) {
        damage /= 2;
        reasons.push(`Enhanced Block - halves incoming ${detail.type} damage`);
      }
      const fullBlockVimCost = Math.floor(damage / 2);
      if (fullBlockVimCost > vim) {
        // partial block
        damage -= vim * 2;
        vimCost = vim;
        reasons.push(`Block - partial ${detail.type} damage blocked`);
      } else {
        damage = 0;
        vimCost += fullBlockVimCost;
        reasons.push(`Block - full ${detail.type} damage blocked`);
      }
    }

    // 6. Apply damage

    damage = Math.max(Math.floor(damage), 0);

    switch (detail.type) {
      case DamageType.VIM: {
        vimCost += damage;
        break;
      }
      case DamageType.BLEED: {
        addToAttrs("bleeding", damage);
        break;
      }
      case DamageType.BURN: {
        addToAttrs("burning", damage);
        break;
      }
      case DamageType.PARALYSIS: {
        addToAttrs("paralysis", damage);
        break;
      }
      case DamageType.STUN: {
        addToAttrs("stun", damage);
        break;
      }
      case DamageType.ATTRIBUTE: {
        addToAttrs(`${detail.attribute}_dmg`, damage);
        break;
      }
      default: {
        addToAttrs("hp", -damage);
      }
    }

    addToAttrs("vim", -vimCost);
    const resultMessage = `Result: attack applies ${damage} ${detail.type} damage`;
    reasons.push(resultMessage);
  }

  addToAttrs("alerts", -response.alerts);
  addToAttrs("reactions", -reactions_used);

  return { adjustAttrs, reasons };
};
