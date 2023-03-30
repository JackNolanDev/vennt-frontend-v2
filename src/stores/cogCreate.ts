import { entityAttributesMap } from "@/utils/attributeUtils";
import {
  cogCreateOptionsValidator,
  type EntityAttribute,
  type UncompleteCollectedEntityWithChangelog,
  type UncompleteEntityText,
  type UpdatedEntityAttributes,
  type CogCreateOptions,
} from "@/utils/backendTypes";
import { cogTypeOptions } from "@/utils/copy/createCogTypeOptions";
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
import { renderMarkdown, editorEmpty } from "@/utils/textUtils";
import { defineStore } from "pinia";
import { useEntityStore } from "./entity";

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
    cogStatBlock(): string {
      let statBlock = [];
      statBlock.push(this.options.name);
      const cogTypeName = cogTypeOptions[this.options.type].replace(/^\*\*(.*?)\*\*.*$/, '$1');
      statBlock.push(`Level ${this.options.level} ${cogTypeName}`);
      statBlock.push(`${this.options.desc.replace(/(<([^>]+)>)/gi, "")}`); //remove HTML tags because I don't know how to make this copyable code use rich formatting
      const attributeString = Object.entries(this.collectedCog.entity.attributes)
        .slice(0,9) //only first 9 attrs
        .map(([key, value]) => `${key.toUpperCase()}: ${value}`).join(", ");
      statBlock.push(attributeString);
      statBlock.push(`Initiative: ${this.collectedCog.entity.attributes.init}`);
      statBlock.push(`HP: ${this.collectedCog.entity.attributes.max_hp}`);
      statBlock.push(`Armor: ${this.cogAttrs.armor?.val ?? 0}`);
      statBlock.push(`Vim: ${this.collectedCog.entity.attributes.max_vim}`);
      statBlock.push(`MP: ${this.collectedCog.entity.attributes.max_mp}`);
      statBlock.push(`Speed: ${this.collectedCog.entity.attributes.speed}`);
      statBlock.push(`Accuracy: ${this.collectedCog.entity.attributes.acc}`);
      const allAbilities = entityAbilities(this.cogAbilities, this.options);
      const abilities = allAbilities.map(({ name, effect }) => ({ name, effect }));
      for (const ability of abilities) {
        statBlock.push(`${ability.name}: ${renderMarkdown(ability.effect)}`); //FIXME I don't think renderMarkdown is what I'm looking for here
      }

      //statBlock.push(JSON.stringify(this.collectedCog, null, 2)); //original JSON
      return statBlock.join("\n");
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
        JSON.stringify(this.options)
      );
    },
    clearCog() {
      localStorage.removeItem(CREATE_COG_LOCAL_STORAGE);
      this.options = DEFAULT_OPTIONS;
    },
  },
});
