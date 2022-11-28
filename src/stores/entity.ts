import {
  addCollectedEntityApi,
  fetchCollectedEntityApi,
} from "@/api/apiEntity";
import router from "@/router";
import type {
  FullCollectedEntity,
  UncompleteCollectedEntity,
} from "@/utils/backendTypes";
import { defineStore } from "pinia";
import { useCharacterCreateStore } from "./characterCreate";

type EntityState = {
  entity: undefined | FullCollectedEntity;
};

type AddCollectedEntityOptions = {
  redirectName: string;
  clearCharacterCreation: boolean;
};

export const useEntityStore = defineStore("entity", {
  state: (): EntityState => {
    return {
      entity: undefined,
    };
  },
  actions: {
    async addCollectedEntity(
      request: UncompleteCollectedEntity,
      options?: Partial<AddCollectedEntityOptions>
    ) {
      this.entity = await addCollectedEntityApi(request);
      if (options?.redirectName) {
        router.push({
          name: options.redirectName,
          params: { id: this.entity.entity.id },
        });
      }
      if (options?.clearCharacterCreation) {
        useCharacterCreateStore().clearCharacter();
      }
    },
    async fetchCollectedEntity(id: string) {
      this.entity = await fetchCollectedEntityApi(id);
    },
  },
});
