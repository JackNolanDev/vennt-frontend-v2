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

type EntityState = {
  entity: undefined | FullCollectedEntity;
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
      redirectName?: string
    ) {
      this.entity = await addCollectedEntityApi(request);
      console.log(this.entity);
      if (redirectName) {
        router.push({
          name: redirectName,
          params: { id: this.entity.entity.id },
        });
      }
    },
    async fetchCollectedEntity(id: string) {
      this.entity = await fetchCollectedEntityApi(id);
    },
  },
});
