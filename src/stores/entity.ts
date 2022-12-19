import {
  addCollectedEntityApi,
  fetchCollectedEntityApi,
  filterEntityChangelogApi,
  updateEntityAttributesApi,
} from "@/api/apiEntity";
import router from "@/router";
import type {
  FilterChangelogBody,
  FullCollectedEntity,
  UncompleteCollectedEntity,
  UpdateEntityAttributes,
} from "@/utils/backendTypes";
import { consolidateItemList } from "@/utils/itemUtils";
import { entityAttributesMap } from "@/utils/attributeUtils";
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
  getters: {
    consolidatedItems: (state) =>
      state.entity ? consolidateItemList(state.entity.items) : [],
    entityAttributes: (state) =>
      state.entity ? entityAttributesMap(state.entity) : {},
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
      await updateEntityAttributesApi(id, request);
      // this sucks - but also I was running into a weird vue error
      await this.fetchCollectedEntity(id);
    },
    async filterChangelog(id: string, request: FilterChangelogBody) {
      if (this.entity) {
        this.entity.changelog = this.entity.changelog.filter(
          (log) => !request.attributes.includes(log.attr)
        );
      }
      await filterEntityChangelogApi(id, request);
    },
  },
});
