import { defineStore } from "pinia";

export const useMapBuilder = defineStore("mapBuilder", {
  state: () => ({
    width: 20,
    height: 20,
  }),
});
