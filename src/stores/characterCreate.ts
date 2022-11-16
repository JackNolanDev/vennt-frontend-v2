import type { CollectedEntity } from "@/utils/backendTypes";
import {
  type CharacterCreateStore,
  calculateAttribute,
  calculateHP,
  calculateVim,
  calculateMP,
  DEFAULT_HERO,
  DEFAULT_HERO_MAX,
  calculateInit,
  calculateSpeed,
} from "@/utils/copy/createCharacterCopy";
import { defineStore } from "pinia";

export const useCharacterCreateStore = defineStore("characterCreate", {
  state: (): CharacterCreateStore => {
    return {
      name: "",
      childAttrs: [],
    };
  },
  getters: {
    per(state) {
      return calculateAttribute(state, "per");
    },
    tek(state) {
      return calculateAttribute(state, "tek");
    },
    agi(state) {
      return calculateAttribute(state, "agi");
    },
    dex(state) {
      return calculateAttribute(state, "dex");
    },
    int(state) {
      return calculateAttribute(state, "int");
    },
    spi(state) {
      return calculateAttribute(state, "spi");
    },
    str(state) {
      return calculateAttribute(state, "str");
    },
    wis(state) {
      return calculateAttribute(state, "wis");
    },
    cha(state) {
      return calculateAttribute(state, "cha");
    },
    hp(): number {
      return calculateHP(0, this.str);
    },
    mp(): number {
      return calculateMP(this.wis);
    },
    vim(): number {
      return calculateVim(0, this.str);
    },
    collectedCharacter(): CollectedEntity {
      return {
        entity: {
          name: this.name,
          type: "CHARACTER",
          attributes: {
            per: this.per,
            tek: this.tek,
            agi: this.agi,
            dex: this.dex,
            int: this.int,
            spi: this.spi,
            str: this.str,
            wis: this.wis,
            cha: this.cha,
            hp: this.hp,
            max_hp: this.hp,
            mp: this.mp,
            max_mp: this.mp,
            vim: this.vim,
            max_vim: this.vim,
            hero: DEFAULT_HERO,
            max_hero: DEFAULT_HERO_MAX,
            init: calculateInit(this.agi, this.dex),
            speed: calculateSpeed(this.agi),
            xp: 0,
            sp: 0,
            gift: this.gift,
          },
        },
        abilities: [],
        items: [],
        changelog: [],
      };
    },
  },
});
