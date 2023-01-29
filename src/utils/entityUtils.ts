import type { CollectedEntity, Entity, EntityTextKey } from "./backendTypes";

export const entityColor = (entity?: Entity): string => {
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
