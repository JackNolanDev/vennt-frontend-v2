import type {
  CollectedEntity,
  DiceCommands,
  DiceSettings,
  DiceToggle,
  DiceToggles,
  EntityAttribute,
  UpdatedEntityAttributes,
} from "./backendTypes";

export function buildDice(
  count: number,
  sides: number,
  adjust: number | string = 0,
  settings: DiceSettings = {},
  comment = ""
): DiceCommands {
  let adjustStr = "";
  if (typeof adjust === "string") {
    adjustStr = adjust;
  } else {
    if (adjust > 0) {
      adjustStr = `+${adjust}`;
    } else if (adjust < 0) {
      adjustStr = adjust.toString();
    }
  }

  let dropLowest = 0;
  let dropHighest = 0;

  const explodeFields = { discord: "", roll20: "", web: "" };
  if (settings.explodes) {
    explodeFields.discord = " ie6";
    explodeFields.roll20 = "!";
    explodeFields.web = "!";
  }
  const rerollFields = { discord: "", roll20: "", web: "" };
  if (settings.rr1s) {
    rerollFields.discord = " ir1";
    rerollFields.roll20 = "r";
    rerollFields.web = "r";
  }
  let fatiguedStr = "";
  if (settings.fatigued) {
    fatiguedStr = "-1";
  }
  let endStr = "";
  if (settings.end) {
    endStr = settings.end;
  }
  if (settings.flow) {
    count += settings.flow;
    dropLowest += settings.flow;
  }
  if (settings.ebb) {
    count += settings.ebb;
    dropHighest += settings.ebb;
  }
  if (settings.drop) {
    dropLowest += settings.drop;
  }
  const dropLowestFields =
    dropLowest === 0
      ? { discord: "", roll20: "", web: "" }
      : {
          discord: ` d${dropLowest}`,
          roll20: `dl${dropLowest}`,
          web: `dl${dropLowest}`,
        };
  const dropHighestFields =
    dropHighest === 0
      ? { discord: "", roll20: "", web: "" }
      : {
          discord: ` kl${count - dropHighest}`,
          roll20: `dh${dropHighest}`,
          web: `dh${dropHighest}`,
        };
  const commentFields = !comment
    ? { discord: "", roll20: "", web: "" }
    : {
        discord: ` ! ${comment}`,
        roll20: ` [${comment}]`,
        web: "",
      };
  return {
    discord:
      count +
      "d" +
      sides +
      explodeFields.discord +
      rerollFields.discord +
      dropLowestFields.discord +
      dropHighestFields.discord +
      " " +
      adjustStr +
      fatiguedStr +
      endStr +
      commentFields.discord,
    roll20:
      count +
      "d" +
      sides +
      explodeFields.roll20 +
      rerollFields.roll20 +
      dropLowestFields.roll20 +
      dropHighestFields.roll20 +
      adjustStr +
      fatiguedStr +
      endStr +
      commentFields.roll20,
    web:
      count +
      "d" +
      sides +
      explodeFields.web +
      rerollFields.web +
      dropLowestFields.web +
      dropHighestFields.web +
      adjustStr +
      fatiguedStr +
      endStr +
      commentFields.web,
    settings: { ...settings, adjust, count, sides },
  };
}

export function defaultDice(
  attrs: UpdatedEntityAttributes,
  attr: EntityAttribute,
  givenSettings: DiceSettings = {},
  diceToggles: DiceToggles = {},
  comment = ""
) {
  const attrMap = attrs[attr];
  const adjust = attrMap ? attrMap.val : 0;

  let diceCount = 3;
  const settings = { ...givenSettings };
  Object.entries(diceToggles).forEach(([key, toggle]) => {
    if (
      settings.otherToggles !== undefined &&
      settings.otherToggles[key] &&
      toggle.attr === attr
    ) {
      if (toggle.diceNumberAdjust !== undefined) {
        diceCount = diceCount + toggle.diceNumberAdjust;
      }
      if (toggle.end !== undefined) {
        if (settings.end !== undefined) {
          settings.end = settings.end + toggle.end;
        } else {
          settings.end = toggle.end;
        }
      }
    }
  });
  return buildDice(diceCount, 6, adjust, settings, comment);
}

export function diceParseFromString(
  diceStr: string,
  settings: DiceSettings = {},
  comment = ""
) {
  const match = diceStr.match(/(\d+)d(\d+)/);
  if (!match || match.length < 3) {
    return undefined;
  }
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  if (isNaN(count) || isNaN(sides)) {
    return undefined;
  }
  const adjust = diceStr.substring(match[0].length);
  return buildDice(count, sides, adjust, settings, comment);
}

// TODO: This should probably either come from the ability / items themselves
// OR for now just move out into a separate JSON file
const diceAbilities: { name: string; toggle: DiceToggle }[] = [
  { name: "Sleight of Hand", toggle: { attr: "dex", end: "+3" } },
];

export function diceToggles(entity: CollectedEntity) {
  const toggles: DiceToggles = {};
  diceAbilities.forEach((diceAbility) => {
    if (entity.abilities.some((ability) => ability.name === diceAbility.name)) {
      toggles[diceAbility.name] = diceAbility.toggle;
    }
  });
  return toggles;
}
