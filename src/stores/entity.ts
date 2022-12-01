import {
  addCollectedEntityApi,
  fetchCollectedEntityApi,
  updateEntityAttributesApi,
} from "@/api/apiEntity";
import router from "@/router";
import type {
  FullCollectedEntity,
  UncompleteCollectedEntity,
  UpdateEntityAttributes,
} from "@/utils/backendTypes";
import { defineStore } from "pinia";
import { useCharacterCreateStore } from "./characterCreate";

type EntityState = {
  entity: undefined | FullCollectedEntity;
  showNotes: boolean;
  levelsToProcess: number;
};

type AddCollectedEntityOptions = {
  redirectName: string;
  clearCharacterCreation: boolean;
};

export const useEntityStore = defineStore("entity", {
  state: (): EntityState => {
    return {
      entity: undefined,
      showNotes: false,
      levelsToProcess: 0,
    };
  },
  actions: {
    toggleNotes() {
      this.showNotes = !this.showNotes;
    },
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
    async updateEntityAttributes(id: string, request: UpdateEntityAttributes) {
      // TODO: may want to pre-apply the change
      const newAttributesEntity = await updateEntityAttributesApi(id, request);
      if (this.entity) {
        this.entity.entity = newAttributesEntity;
        // todo - need to fix this to update whole object so reactive things work
      }
    },
  },
});
