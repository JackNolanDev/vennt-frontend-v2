import {
  cogCreateOptionsValidator,
  type UncompleteCollectedEntityWithChangelog,
  type UncompleteEntityText,
  type CogCreateOptions,
  computeAttributes,
  type ComputedAttributes,
} from "vennt-library";
import {
  cogBaseAttribute,
  cogAcc,
  cogInit,
  cogHP,
  cogVim,
  cogMP,
  cogSpeed,
  cogAbilities,
  LStat,
  entityAbilities,
  totalAP,
  spentAP,
} from "@/utils/copy/createCogLogic";
import { editorEmpty } from "@/utils/textUtils";
import { defineStore } from "pinia";
import { useEntityStore } from "./entity";
import { getCopyableCogText } from "@/utils/entityUtils";

export const CREATE_COG_LOCAL_STORAGE = "create_cog";

type CogCreateStore = {
  options: CogCreateOptions;
  edit_id?: string;
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
      return {
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
            cog_creation_options: this.options,
          },
          public: false,
        },
        text,
        abilities: entityAbilities(this.cogAbilities, this.options),
        items: [],
        flux: [],
        changelog: [],
      };
    },
    cogAttrs(): ComputedAttributes {
      return computeAttributes(this.collectedCog);
    },
    cogStatBlock(): string {
      return getCopyableCogText(this.collectedCog, this.cogAttrs);
    },
  },
  actions: {
    async loadFromEntityId(id: string | undefined) {
      if (!id) {
        this.loadFromLocalStorage();
        return;
      }
      const entityStore = useEntityStore();
      // TODO: Clean up this code to reduce duplication
      if (
        entityStore.entity?.entity.id === id &&
        entityStore.entity.entity.other_fields.cog_creation_options
      ) {
        this.options =
          entityStore.entity.entity.other_fields.cog_creation_options;
        this.edit_id = id;
        console.log("Entity already in entityStore, no further work necessary");
      } else {
        await entityStore.fetchCollectedEntity(id);
        if (
          entityStore.entity?.entity.id === id &&
          entityStore.entity.entity.other_fields.cog_creation_options
        ) {
          this.options =
            entityStore.entity.entity.other_fields.cog_creation_options;
          this.edit_id = id;
          console.log("Entity needed to be fetched");
        } else {
          this.loadFromLocalStorage();
        }
      }
    },
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
    // TODO: If `edit_id` is set, we should save to the entity on the server.
    // Also, when the entity is finally saved / the changes confirmed, instead of creating a new entity
    // with their choices, we should just update the current entity.
    saveToLocalStorage() {
      localStorage.setItem(
        CREATE_COG_LOCAL_STORAGE,
        JSON.stringify(this.options),
      );
    },
    clearCog() {
      localStorage.removeItem(CREATE_COG_LOCAL_STORAGE);
      this.options = DEFAULT_OPTIONS;
    },
  },
});
