import { useEntityStore } from "./entity";
import type { SaveState } from "@/utils/backendTypes";
import { defineStore } from "pinia";

interface EntityNotesStore {
  liveNotes: string;
  timeout?: ReturnType<typeof setTimeout>;
  edited: boolean;
  showNotes: boolean;
}

export const useEntityNotesStore = defineStore("entityNotes", {
  state: (): EntityNotesStore => ({
    liveNotes: "",
    edited: false,
    showNotes: false,
  }),
  getters: {
    saveState: (state): SaveState => {
      if (state.edited) {
        return "EDITING";
      } else if (useEntityStore().apisInFlight["NOTES"]) {
        return "SAVING";
      }
      return "SAVED";
    },
  },
  actions: {
    reset() {
      this.liveNotes = "";
      this.timeout = undefined;
      this.edited = false;
      this.showNotes = false;
    },
    toggleNotes() {
      this.showNotes = !this.showNotes;
    },
    setInitialNotes(notes: string) {
      if (!this.liveNotes) {
        this.liveNotes = notes;
      }
    },
    typing() {
      if (!this.edited) {
        this.edited = true;
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(this.saveNotes, 5_000);
    },
    saveNotes() {
      if (this.edited) {
        this.edited = false;
        useEntityStore().saveText("NOTES", this.liveNotes);
      }
    },
  },
});
