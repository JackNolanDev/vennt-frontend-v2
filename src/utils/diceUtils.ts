import { replaceVariablesInEquation } from "./attributeUtils";
import { abilityPassCriteriaCheck } from "./criteriaUtils";
import {
  type CollectedEntity,
  type DiceCommands,
  type DiceSettings,
  type DiceToggle,
  type DiceToggles,
  type EntityAttribute,
  type UpdatedEntityAttributes,
  type UsesCheck,
  buildDice,
} from "vennt-library";

export const defaultDice = (
  attrs: UpdatedEntityAttributes,
  attr: EntityAttribute,
  givenSettings: DiceSettings = {},
  diceToggles: DiceToggles = {},
  comment = "",
  skipKey = "",
): DiceCommands => {
  const attrMap = attrs[attr];
  const adjust = attrMap ? attrMap.val : 0;

  let settings = { ...givenSettings };
  settings = combineEnabledTogglesSettings(
    settings,
    diceToggles,
    attrs,
    [attr],
    skipKey,
  );
  return buildDice(
    settings.count ?? 3,
    settings.sides ?? 6,
    adjust,
    settings,
    comment,
  );
};

export const diceParseFromString = (
  diceStr: string,
  givenSettings: DiceSettings = {},
  comment = "",
  diceToggles: DiceToggles = {},
  attrs?: UpdatedEntityAttributes,
  relevantAttrs?: EntityAttribute[],
): DiceCommands | undefined => {
  const match = diceStr.match(/\(?(\d+)\)?d(\d+)/u);
  if (!match || match.length < 3) {
    return undefined;
  }
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  if (isNaN(count) || isNaN(sides)) {
    return undefined;
  }
  const adjust = diceStr.substring(match[0].length);

  let settings = { ...givenSettings };
  if (attrs && relevantAttrs) {
    settings = combineEnabledTogglesSettings(
      settings,
      diceToggles,
      attrs,
      relevantAttrs,
    );
  }

  return buildDice(count, sides, adjust, settings, comment);
};

const combineEnabledTogglesSettings = (
  settings: DiceSettings,
  diceToggles: DiceToggles,
  attrs: UpdatedEntityAttributes,
  relevantAttrs: EntityAttribute[],
  skipKey = "",
): DiceSettings => {
  Object.entries(diceToggles).forEach(([key, toggle]) => {
    if (
      settings.otherToggles &&
      (settings.otherToggles[key]?.toggled ?? toggle.default) &&
      toggle.attr &&
      relevantAttrs.includes(toggle.attr) &&
      skipKey !== key
    ) {
      settings = combineDiceSettings(settings, toggle.setting, attrs);
    }
  });
  return settings;
};

export const buildSettingsForAttrList = (
  baseSettings: DiceSettings,
  relatedAttrs: EntityAttribute[],
  attrs: UpdatedEntityAttributes,
): DiceSettings =>
  relatedAttrs.reduce((settings, attr) => {
    const attrMap = attrs[attr];
    if (!attrMap?.dice) {
      return settings;
    }
    return combineDiceSettings(settings, attrMap.dice, attrs);
  }, baseSettings);

export const diceTogglesForEntity = (
  entity: CollectedEntity,
  attrs: UpdatedEntityAttributes,
): DiceToggles => {
  const toggles: DiceToggles = {};

  const saveSettingToToggle = (key: string, check?: UsesCheck): void => {
    if (!check) {
      return;
    }
    const setting: DiceSettings = check.dice_settings ?? {
      end: check.bonus,
    };
    const toggle: DiceToggle = {
      setting,
      attr: check.attr,
      label: check.label,
    };
    toggles[key] = toggle;
  };

  entity.abilities.forEach((ability) => {
    const checks =
      ability.uses?.criteria_benefits
        ?.filter(
          (criteria) =>
            criteria.check &&
            abilityPassCriteriaCheck(criteria.criteria, ability, null, attrs),
        )
        .map((criteria) => criteria.check) ?? [];
    checks.push(ability.uses?.check);
    checks.forEach((check) => {
      saveSettingToToggle(ability.name, check);
    });
  });

  entity.items
    .filter(
      (item) =>
        (item.active || item.type === "equipment") &&
        !item.custom_fields?.in_storage,
    )
    .forEach((item) => {
      saveSettingToToggle(item.name, item.uses?.check);
    });

  // console.log(toggles);

  return toggles;
};

export const combineDiceSettings = (
  baseSettings: DiceSettings,
  newSettings: DiceSettings,
  attrs: UpdatedEntityAttributes,
): DiceSettings => {
  const settings = {
    ...baseSettings,
  };
  if (newSettings.count) {
    settings.count = (settings.count ?? 3) + newSettings.count;
  }
  if (newSettings.sides) {
    settings.sides = (settings.sides ?? 6) + newSettings.sides;
  }
  if (newSettings.drop) {
    settings.drop = (settings.drop ?? 0) + newSettings.drop;
  }
  if (newSettings.ebb) {
    settings.ebb = (settings.ebb ?? 0) + newSettings.ebb;
  }
  if (newSettings.flow) {
    settings.flow = (settings.flow ?? 0) + newSettings.flow;
  }
  if (newSettings.end) {
    settings.end = replaceVariablesInEquation(
      `${settings.end ?? ""}${newSettings.end}`,
      attrs,
    ).cleanedEquation;
  }
  if (newSettings.explodes) {
    settings.explodes = true;
  }
  if (newSettings.rr1s) {
    settings.rr1s = true;
  }
  if (newSettings.fatigued) {
    settings.fatigued = true;
  }
  return settings;
};
