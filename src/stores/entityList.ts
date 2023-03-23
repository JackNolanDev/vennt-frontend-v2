import { listEntitiesApi } from "@/api/apiEntity";
import type { FullEntity } from "@/utils/backendTypes";
import { defineStore } from "pinia";

type EntityListStore = {
  entities: FullEntity[];
};

export const useEntityListStore = defineStore("entityList", {
  state: (): EntityListStore => {
    return {
      entities: [],
    };
  },
  getters: {
    characters(state) {
      return state.entities.filter((entity) => entity.type === "CHARACTER");
    },
    cogs(state) {
      return state.entities.filter((entity) => entity.type === "COG");
    },
  },
  actions: {
    reset() {
      this.entities = [];
    },
    async fetchEntities() {
      this.entities = await listEntitiesApi();
    },
  },
});
