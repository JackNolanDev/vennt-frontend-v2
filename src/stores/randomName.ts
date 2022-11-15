import { defineStore } from "pinia";
import { fetchRandomNamesApi } from "@/api/apiRandomNames";

interface RandomNameStore {
  randomNames: string[];
  randomNamesEnabled: boolean | undefined;
}

export const useRandomNameStore = defineStore("randomNames", {
  state: (): RandomNameStore => {
    return {
      randomNames: [],
      randomNamesEnabled: undefined,
    };
  },
  actions: {
    async fetchRandomNames() {
      if (this.randomNamesEnabled !== false) {
        try {
          this.randomNames = await fetchRandomNamesApi();
          this.randomNamesEnabled = true;
        } catch (err) {
          this.randomNamesEnabled = false;
        }
      }
    },
    shiftNames() {
      this.randomNames.shift();
    },
  },
});
