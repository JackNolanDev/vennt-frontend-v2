import {
  ATTRIBUTES,
  type CampaignEntity,
  type CollectedEntity,
  type Entity,
  type EntityAttribute,
  type EntityTextKey,
  type UncompleteCollectedEntityWithChangelog,
  type UpdatedEntityAttributes,
} from "vennt-library";
import { cogTypeName } from "./copy/createCogTypeOptions";
import TurndownService from "turndown";
import { attrFullName, attrShortName, getMaxAttr } from "./attributeUtils";
import { renderMarkdown } from "./textUtils";

export const entityColor = (entity?: Entity | CampaignEntity): string => {
  if (!entity) {
    return "var(--red-600)";
  }
  const red =
    entity.attributes.str + entity.attributes.agi + entity.attributes.cha;
  const green =
    entity.attributes.tek + entity.attributes.int + entity.attributes.dex;
  const blue =
    entity.attributes.wis + entity.attributes.spi + entity.attributes.per;
  const sum = red + green + blue;
  return (
    "#" +
    hexColorComponent(red, sum) +
    hexColorComponent(green, sum) +
    hexColorComponent(blue, sum)
  );
};

const hexColorComponent = (component: number, sum: number): string => {
  if (sum <= 0) {
    sum = 1;
  }
  if (component < 0) {
    component = 0;
  }
  const numStr = Math.floor((component / sum) * 256).toString(16);
  if (numStr.length === 1) {
    return "0" + numStr;
  } else if (numStr.length > 2) {
    return "ff";
  }
  return numStr;
};

export const getEntityText = (
  key: EntityTextKey,
  entity?: CollectedEntity
): string | undefined => {
  if (!entity) {
    return undefined;
  }
  const found = entity.text.find((text) => text.key === key);
  return found ? found.text : "";
};

export const defaultEntityTextPermission = (key: EntityTextKey): boolean => {
  const map: Record<EntityTextKey, boolean> = {
    NOTES: false,
    DESC: true,
    BACKSTORY: false,
  };
  return map[key] ?? false;
};

export const getCopyableCogText = (
  entity: CollectedEntity,
  attrs: UpdatedEntityAttributes
): string => {
  const attrStr = (attr: EntityAttribute): string[] => {
    const attrVal = attrs[attr]?.val;
    if (!attrVal) {
      return [];
    }
    const maxAttr = getMaxAttr(attr);
    const maxAttrVal = maxAttr && attrs[maxAttr]?.val;
    const maxAttrStr = maxAttrVal ? ` / ${maxAttrVal}` : "";
    return [`${attrFullName(attr)}: ${attrVal}${maxAttrStr}`];
  };
  const turndownService = new TurndownService();
  const description = getEntityText("DESC", entity);
  const descLine = description ? [turndownService.turndown(description)] : [];
  const basicAttrs = ATTRIBUTES.map(
    (attr) => `${attrShortName(attr)}: ${attrs[attr]?.val}`
  ).join(", ");
  const abilities = entity.abilities.map(
    (ability) =>
      `${ability.name}: ${turndownService.turndown(
        renderMarkdown(ability.effect, attrs)
      )}`
  );
  const statBlock = [
    entity.entity.name,
    `Level ${attrs.L?.val} ${cogTypeName(entity.entity.other_fields.cog_type)}`,
    ...descLine,
    basicAttrs,
    ...attrStr("init"),
    ...attrStr("hp"),
    ...attrStr("armor"),
    ...attrStr("vim"),
    ...attrStr("mp"),
    ...attrStr("speed"),
    ...attrStr("acc"),
    ...abilities,
  ];
  return statBlock.join("\n");
};

export const entityCreationFullyHealed = (
  entity: UncompleteCollectedEntityWithChangelog,
  attrs: UpdatedEntityAttributes
): UncompleteCollectedEntityWithChangelog => {
  const keepEqual: Record<EntityAttribute, EntityAttribute> = {
    hp: "max_hp",
    vim: "max_vim",
    mp: "max_mp",
  };
  Object.entries(keepEqual).forEach(([attr, maxAttr]) => {
    entity.entity.attributes[attr as EntityAttribute] = attrs[maxAttr]!.val;
  });
  return entity;
};
