import type { CollectedEntity } from "@/utils/backendTypes";
import {
  calculateAttribute,
  calculateHP,
  calculateVim,
  calculateMP,
  DEFAULT_HERO,
  DEFAULT_HERO_MAX,
  calculateInit,
  calculateSpeed,
  characterCreateOptionsValidator,
  type CharacterCreateOptions,
  calculateSP,
  calculateXP,
  calculateItems,
} from "@/utils/copy/createCharacterCopy";
import { defineStore } from "pinia";

export const CREATE_CHARACTER_LOCAL_STORAGE = "create_character";

type CharacterCreateStore = {
  options: CharacterCreateOptions;
};

export const useCharacterCreateStore = defineStore("characterCreate", {
  state: (): CharacterCreateStore => {
    return {
      options: {
        name: "",
        attributeSelections: {
          childAttrs: [],
          adultAttrs: [],
          additionalAttrs: [],
          badAttrs: [],
          grate1: [],
          grate3: [],
        },
        radioSelections: {
          additionalAttrChoice: "",
          sideItem: "",
          rememberItem: "",
          outfit: "",
          itemSet: "",
          experience: "",
        },
      },
    };
  },
  getters: {
    per(state) {
      return calculateAttribute(state.options, "per");
    },
    tek(state) {
      return calculateAttribute(state.options, "tek");
    },
    agi(state) {
      return calculateAttribute(state.options, "agi");
    },
    dex(state) {
      return calculateAttribute(state.options, "dex");
    },
    int(state) {
      return calculateAttribute(state.options, "int");
    },
    spi(state) {
      return calculateAttribute(state.options, "spi");
    },
    str(state) {
      return calculateAttribute(state.options, "str");
    },
    wis(state) {
      return calculateAttribute(state.options, "wis");
    },
    cha(state) {
      return calculateAttribute(state.options, "cha");
    },
    xp(state) {
      return calculateXP(state.options);
    },
    sp(state) {
      return calculateSP(state.options);
    },
    hp(): number {
      return calculateHP(this.xp, this.str);
    },
    mp(): number {
      return calculateMP(this.wis);
    },
    vim(): number {
      return calculateVim(this.xp, this.str);
    },
    collectedCharacter(): CollectedEntity {
      return {
        entity: {
          name: this.options.name,
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
            xp: this.xp,
            sp: this.sp,
          },
          other_fields: {
            gift: this.options.gift,
          },
        },
        abilities: [],
        items: calculateItems(this.options),
        changelog: [],
      };
    },
  },
  actions: {
    loadFromLocalStorage() {
      const rawOptions = localStorage.getItem(CREATE_CHARACTER_LOCAL_STORAGE);
      if (rawOptions) {
        try {
          const jsonOptions = JSON.parse(rawOptions);
          this.options = characterCreateOptionsValidator.parse(jsonOptions);
        } catch (err) {
          localStorage.removeItem(CREATE_CHARACTER_LOCAL_STORAGE);
        }
      }
    },
    saveToLocalStorage() {
      localStorage.setItem(
        CREATE_CHARACTER_LOCAL_STORAGE,
        JSON.stringify(this.options)
      );
    },
  },
});
