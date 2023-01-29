<template>
  <div
    class="card border column notesCard"
    v-bind:style="{ height: state.boxHeight + 'px' }"
  >
    <div @mousedown="headerDragStart" class="alignRow split notesHeader">
      <label for="character-notes-field" class="labelText ml-8">Notes</label>
      <div class="alignRow">
        <SaveStateIcon
          :state="saveState"
          subject="Notes"
          class="mr-8"
        ></SaveStateIcon>
        <BaseButton @click="entityStore.toggleNotes" icon="close"></BaseButton>
      </div>
    </div>
    <BaseFullFeaturedTextEditor
      v-model="state.liveNotes"
      @update:modelValue="typing"
      placeholder="write character notes here"
    ></BaseFullFeaturedTextEditor>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { computed, onBeforeMount, onBeforeUnmount, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import BaseFullFeaturedTextEditor from "../Base/BaseFullFeaturedTextEditor.vue";
import SaveStateIcon from "../Base/SaveStateIcon.vue";
import type { SaveState } from "@/utils/backendTypes";

const entityStore = useEntityStore();

interface EntityNotesState {
  liveNotes: string;
  boxHeight: number;
  startMouseY: number;
  startBoxHeight: number;
  timeout?: ReturnType<typeof setTimeout>;
  edited: boolean;
}

const state = reactive<EntityNotesState>({
  liveNotes: entityStore.notes ? entityStore.notes : "",
  boxHeight: 200,
  startMouseY: 0,
  startBoxHeight: 0,
  timeout: undefined,
  edited: false,
});

onBeforeMount(() => {
  const localHeight = localStorage.getItem(localStorageId.value);
  if (localHeight) {
    const parsedHeight = parseInt(localHeight);
    if (parsedHeight && !isNaN(parsedHeight)) {
      state.boxHeight = parsedHeight;
    }
  }
});

onBeforeUnmount(() => {
  saveNotes();
});

const localStorageId = computed(() => entityStore.entity?.entity.id + "-nh");
const saveState = computed((): SaveState => {
  if (state.edited) {
    return "EDITING";
  }
  if (entityStore.apisInFlight["NOTES"]) {
    return "SAVING";
  }
  return "SAVED";
});

const headerDragStart = (e: MouseEvent) => {
  e.preventDefault();
  state.startMouseY = e.clientY;
  state.startBoxHeight = state.boxHeight;
  document.onmouseup = endDrag;
  document.onmousemove = dragHeader;
};

const dragHeader = (e: MouseEvent) => {
  e.preventDefault();
  const offset = state.startMouseY - e.clientY;
  state.boxHeight = Math.min(
    Math.max(state.startBoxHeight + offset, 80),
    window.innerHeight
  );
};

const endDrag = () => {
  document.onmouseup = null;
  document.onmousemove = null;
  localStorage.setItem(localStorageId.value, state.boxHeight.toString());
};

const typing = () => {
  if (!state.edited) {
    state.edited = true;
  }
  if (state.timeout) {
    clearTimeout(state.timeout);
  }
  state.timeout = setTimeout(saveNotes, 5_000);
};

const saveNotes = () => {
  if (state.edited) {
    state.edited = false;
    entityStore.saveText("NOTES", state.liveNotes);
  }
};
</script>

<style scoped>
.notesCard {
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  width: calc(100% - 2px);
  background-color: var(--background-low-contrast);
}
.notesCard:focus-within {
  border-color: var(--border-focus);
}
.notesHeader {
  cursor: row-resize;
  border-bottom: 1px solid var(--border);
}
.notesCard >>> .editor-wrapper {
  background-color: unset;
  border: none;
  height: 100%;
  overflow-y: auto;
}
.notesCard >>> .ProseMirror {
  height: 100%;
}
</style>
