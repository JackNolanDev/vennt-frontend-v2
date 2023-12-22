import type { FullEntityAbility } from "vennt-library";

export const defaultAbilitySort = (paths: string[]) =>
  abilitySortFunction(sortByPath(paths));

export const sortByPath = (
  paths: string[],
): ((a1: FullEntityAbility, a2: FullEntityAbility) => number) => {
  return (a1, a2) => {
    if (
      a1.custom_fields?.path &&
      a2.custom_fields?.path &&
      a1.custom_fields.path !== a2.custom_fields.path
    ) {
      const pathIdx = (given: string) =>
        paths.findIndex((path) => path === given);
      return pathIdx(a1.custom_fields.path) - pathIdx(a2.custom_fields.path);
    }
    return 0;
  };
};

export const sortByName = (
  a1: FullEntityAbility,
  a2: FullEntityAbility,
): number => a1.name.localeCompare(a2.name);

const actionsForAbility = (ability: FullEntityAbility): number => {
  if (ability.custom_fields?.cost?.actions) {
    return ability.custom_fields.cost.actions;
  } else if (
    ability.custom_fields?.activation &&
    ability.custom_fields.activation.includes("Action")
  ) {
    if (ability.custom_fields.activation.includes("Free Action")) {
      return 0;
    }
    return 3;
  }
  return 0;
};

const reactionsForAbility = (ability: FullEntityAbility): number => {
  if (ability.custom_fields?.cost?.reactions) {
    return ability.custom_fields.cost.reactions;
  } else if (
    ability.custom_fields?.activation &&
    ability.custom_fields.activation.includes("Reaction")
  ) {
    if (ability.custom_fields.activation.includes("Free Reaction")) {
      return 0;
    }
    return 1;
  }
  return 0;
};

const vimForAbility = (ability: FullEntityAbility): number => {
  if (ability.custom_fields?.cost?.vim) {
    return ability.custom_fields.cost.vim;
  } else if (
    ability.custom_fields?.activation &&
    ability.custom_fields.activation.includes("Vim")
  ) {
    return 1;
  }
  return 0;
};

const mpForAbility = (ability: FullEntityAbility): number => {
  if (ability.custom_fields?.cost?.mp) {
    return ability.custom_fields.cost.mp;
  } else if (ability.custom_fields?.mp_cost) {
    return ability.custom_fields.mp_cost.reduce(
      (max, cost) => Math.max(max, cost),
      0,
    );
  } else if (
    ability.custom_fields?.activation &&
    ability.custom_fields.activation.includes("MP")
  ) {
    return 5;
  }
  return 0;
};

const heroForAbility = (ability: FullEntityAbility): number => {
  if (ability.custom_fields?.cost?.hero) {
    return ability.custom_fields.cost.hero;
  }
  return 0;
};

const timeForAbility = (ability: FullEntityAbility): number => {
  if (ability.custom_fields?.cost?.passive) {
    return 10;
  }
  if (ability.custom_fields?.cost?.intermission) {
    return 8;
  }
  if (ability.custom_fields?.cost?.rest) {
    return 8;
  }
  if (ability.custom_fields?.cost?.respite) {
    return 6;
  }
  if (ability.custom_fields?.cost?.attack) {
    return 0;
  }
  return 2;
};

export const sortByActivation = (
  a1: FullEntityAbility,
  a2: FullEntityAbility,
): number => {
  const diffs = [
    timeForAbility,
    actionsForAbility,
    reactionsForAbility,
    heroForAbility,
    mpForAbility,
    vimForAbility,
  ];
  for (const diffFun of diffs) {
    const diff = diffFun(a1) - diffFun(a2);
    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
};

export const abilitySortFunction = (
  primarySort: (a1: FullEntityAbility, a2: FullEntityAbility) => number,
  options?: {
    separatePassive?: boolean;
    inverse?: boolean;
  },
): ((a1: FullEntityAbility, a2: FullEntityAbility) => number) => {
  const { separatePassive = true, inverse = false } = options ?? {};

  const costInt = (purchase?: string) => {
    if (purchase === undefined) {
      return 0;
    }
    const cost = parseInt(purchase);
    if (isNaN(cost)) {
      return 0;
    }
    return cost;
  };

  const resultVal = (val: number): number => (inverse ? -val : val);
  return (a1, a2) => {
    // 0. put abilities with stars at the top of the list
    const a1Stars = a1.custom_fields?.stars ?? 0;
    const a2Stars = a2.custom_fields?.stars ?? 0;
    if ((a1Stars > 0 || a2Stars > 0) && a1Stars !== a2Stars) {
      return resultVal(a2Stars - a1Stars);
    }
    // 1. put Passive abilities at the end of the list
    const a1Passive =
      a1.custom_fields?.cost?.passive ||
      a1.custom_fields?.activation?.toLowerCase() === "passive";
    const a2Passive =
      a2.custom_fields?.cost?.passive ||
      a2.custom_fields?.activation?.toLowerCase() === "passive";
    if (separatePassive) {
      if (!a1Passive && a2Passive) {
        return resultVal(-1);
      } else if (a1Passive && !a2Passive) {
        return resultVal(1);
      }
    }
    // 2. put abilities which use SP instead of XP at the end of the list when passive
    if (
      separatePassive &&
      a1Passive &&
      a1.custom_fields?.purchase &&
      a2Passive &&
      a2.custom_fields?.purchase
    ) {
      const a1SP = a1.custom_fields.purchase.includes("sp");
      const a2SP = a2.custom_fields.purchase.includes("sp");
      if (!a1SP && a2SP) {
        return resultVal(-1);
      } else if (a1SP && !a2SP) {
        return resultVal(1);
      }
    }
    // 3. sort by primary function
    const primary = primarySort(a1, a2);
    if (primary !== 0) {
      return resultVal(primary);
    }
    // 4. sort by XP price otherwise (for now at least)
    const diff =
      costInt(a1.custom_fields?.purchase) - costInt(a2.custom_fields?.purchase);
    if (diff !== 0) {
      return resultVal(diff);
    }
    return resultVal(a1.name.localeCompare(a2.name));
  };
};
