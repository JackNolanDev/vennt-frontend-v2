import { entityAttributesMap } from "@/utils/attributeUtils";
import type {
  EntityAttribute,
  UncompleteCollectedEntityWithChangelog,
  UncompleteEntityText,
  UpdatedEntityAttributes,
} from "@/utils/backendTypes";
import {
  cogBaseAttribute,
  cogCreateOptionsValidator,
  cogAcc,
  cogInit,
  cogHP,
  cogVim,
  cogMP,
  cogSpeed,
  cogAbilities,
  LStat,
  type CogCreateOptions,
  entityAbilities,
  totalAP,
  spentAP,
} from "@/utils/copy/createCogLogic";
import { editorEmpty } from "@/utils/textUtils";
import { defineStore } from "pinia";

export const CREATE_COG_LOCAL_STORAGE = "create_cog";

type CogCreateStore = {
  options: CogCreateOptions;
};

const DEFAULT_OPTIONS: CogCreateOptions = {
  name: "",
  level: "",
  type: "",
  desc: "",
  attrOverrides: {},
  abilitySelection: {},
  variableAbilityCost: {},
};

export const useCogCreateStore = defineStore("cogCreate", {
  state: (): CogCreateStore => {
    return {
      options: DEFAULT_OPTIONS,
    };
  },
  getters: {
    LStat: (state) => LStat(state.options.level),
    cogAbilities: (state) => cogAbilities(state.options),
    totalAP: (state) => totalAP(state.options),
    remainingAP(): number {
      return this.totalAP - spentAP(this.cogAbilities, this.options);
    },
    collectedCog(): UncompleteCollectedEntityWithChangelog {
      const text: UncompleteEntityText[] = [];
      if (!editorEmpty(this.options.desc)) {
        text.push({
          public: true,
          text: this.options.desc,
          key: "DESC",
        });
      }
      const entity: UncompleteCollectedEntityWithChangelog = {
        entity: {
          name: this.options.name,
          type: "COG",
          attributes: {
            per: cogBaseAttribute(this.options, "per"),
            tek: cogBaseAttribute(this.options, "tek"),
            agi: cogBaseAttribute(this.options, "agi"),
            dex: cogBaseAttribute(this.options, "dex"),
            int: cogBaseAttribute(this.options, "int"),
            spi: cogBaseAttribute(this.options, "spi"),
            str: cogBaseAttribute(this.options, "str"),
            wis: cogBaseAttribute(this.options, "wis"),
            cha: cogBaseAttribute(this.options, "cha"),
            hp: cogHP(this.options),
            max_hp: cogHP(this.options),
            mp: cogMP(this.options),
            max_mp: cogMP(this.options),
            vim: cogVim(this.options),
            max_vim: cogVim(this.options),
            init: cogInit(this.options),
            speed: cogSpeed(this.options),
            L: this.LStat,
            acc: cogAcc(this.options),
          },
          other_fields: {
            cog_type: this.options.type,
          },
          public: false,
        },
        text,
        abilities: entityAbilities(this.cogAbilities),
        items: [],
        flux: [],
        changelog: [],
      };
      if (this.options.level !== "") {
        entity.entity.attributes.L = this.LStat;
      }
      return entity;
    },
    cogAttrs(): UpdatedEntityAttributes {
      const attrs = entityAttributesMap(this.collectedCog);
      // Kinda hacky, but we need to make sure hp, vim, and mp stay equal with their max values during cog creation
      const keepEqual: Partial<Record<EntityAttribute, EntityAttribute>> = {
        hp: "max_hp",
        vim: "max_vim",
        mp: "max_mp",
      };
      Object.entries(keepEqual).forEach(([attr, maxAttr]) => {
        attrs[attr as EntityAttribute]!.val = attrs[maxAttr]!.val;
      });
      return attrs;
    },
  },
  actions: {
    loadFromLocalStorage() {
      const rawOptions = localStorage.getItem(CREATE_COG_LOCAL_STORAGE);
      if (rawOptions) {
        try {
          const jsonOptions = JSON.parse(rawOptions);
          this.options = cogCreateOptionsValidator.parse(jsonOptions);
        } catch (err) {
          localStorage.removeItem(CREATE_COG_LOCAL_STORAGE);
        }
      }
    },
    saveToLocalStorage() {
      localStorage.setItem(
        CREATE_COG_LOCAL_STORAGE,
        JSON.stringify(this.options)
      );
    },
    clearCog() {
      localStorage.removeItem(CREATE_COG_LOCAL_STORAGE);
      this.options = DEFAULT_OPTIONS;
    },
  },
});
