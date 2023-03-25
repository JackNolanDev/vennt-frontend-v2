import type {
  HTMLString,
  BaseEntityAttribute,
  CogAttributeLevel,
} from "../backendTypes";

export const cogTypeOptionsInfo: Record<
  string,
  {
    text: HTMLString;
    attrs: Partial<Record<BaseEntityAttribute, CogAttributeLevel>>;
  }
> = {
  // NOTE: "moderate" is assumed as the default, so its not necessary to define
  arcanae: {
    text: `**Arcanae**: a magical being, creature, or creation`,
    attrs: {},
  },
  automata: {
    text: `**Automata**: a robotic or technological construction`,
    attrs: {
      cha: "weak",
      wis: "weak",
      spi: "weak",
      tek: "strong",
    },
  },
  beastFlora: {
    text: `**Beast / Flora**: an animal or plant of bestial instinct`,
    attrs: {
      wis: "weak",
      tek: "weak",
      int: "weak",
      str: "strong",
      dex: "strong",
      per: "strong",
      agi: "strong",
    },
  },
  humanoid: {
    text: `**Humanoid**: a sentient, human or human-like creature such as elves and orcs`,
    attrs: {},
  },
  monster: {
    text: `**Monster**: a chaotic and exotic beast, including most creatures of the Tributaries`,
    attrs: {
      str: "strong",
      dex: "strong",
      per: "strong",
      agi: "strong",
    },
  },
  undead: {
    text: `**Undead**: creatures raised from the dead, often by dark magicks or curses`,
    attrs: {
      cha: "weak",
      tek: "weak",
      spi: "weak",
      int: "weak",
    },
  },
};

export const cogTypeOptions = Object.entries(cogTypeOptionsInfo).reduce<
  Record<string, HTMLString>
>((acc, [option, val]) => ({ ...acc, [option]: val.text }), {});
