import { entityAttributesMap } from "@/utils/attributeUtils";
import type {
  UncompleteCollectedEntityWithChangelog,
  UncompleteEntityFlux,
  UncompleteEntityText,
  UpdatedEntityAttributes,
} from "vennt-library";
import {
  calculateAttribute,
  DEFAULT_HERO,
  DEFAULT_HERO_MAX,
  characterCreateOptionsValidator,
  type CharacterCreateOptions,
  calculateSP,
  calculateXP,
  calculateItems,
  calculateAbilities,
} from "@/utils/copy/createCharacterCopy";
import { editorEmpty } from "@/utils/textUtils";
import { defineStore } from "pinia";

export const CREATE_CHARACTER_LOCAL_STORAGE = "create_character";

type CharacterCreateStore = {
  options: CharacterCreateOptions;
};

const DEFAULT_OPTIONS: CharacterCreateOptions = {
  name: "",
  attributeSelections: {
    childAttrs: [],
    adultAttrs: [],
    noGiftAttrs: [],
    badAttrs: [],
    grate1: [],
    grate3: [],
  },
  radioSelections: {
    sideItem: "",
    itemSet: "",
    guildRank: "",
  },
  desc: "",
  backstory: "",
  quests: ["", "", ""],
};

export const useCharacterCreateStore = defineStore("characterCreate", {
  state: (): CharacterCreateStore => {
    return {
      options: DEFAULT_OPTIONS,
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
    collectedCharacter(): UncompleteCollectedEntityWithChangelog {
      const text: UncompleteEntityText[] = [];
      if (!editorEmpty(this.options.desc)) {
        text.push({
          public: true,
          text: this.options.desc,
          key: "DESC",
        });
      }
      if (!editorEmpty(this.options.backstory)) {
        text.push({
          public: false,
          text: this.options.backstory,
          key: "BACKSTORY",
        });
      }
      const flux = this.options.quests
        .filter((quest) => !editorEmpty(quest))
        .map((quest): UncompleteEntityFlux => ({ type: "QUEST", text: quest }));
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
            hp: 0,
            max_hp: 0,
            mp: 0,
            max_mp: 0,
            vim: 0,
            max_vim: 0,
            hero: DEFAULT_HERO,
            max_hero: DEFAULT_HERO_MAX,
            init: 0,
            speed: 0,
            xp: calculateXP(),
            sp: calculateSP(this.options),
          },
          other_fields: {
            gift: this.options.gift,
          },
          public: false,
        },
        abilities: calculateAbilities(this.options),
        items: calculateItems(this.options),
        changelog: [],
        text,
        flux,
      };
    },
    characterAttrs(): UpdatedEntityAttributes {
      return entityAttributesMap(this.collectedCharacter);
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
    clearCharacter() {
      localStorage.removeItem(CREATE_CHARACTER_LOCAL_STORAGE);
      this.options = DEFAULT_OPTIONS;
    },
  },
});
