<template>
  <div
    class="card border column notesCard"
    v-bind:style="{ height: state.boxHeight + 'px' }"
    @keyup.esc="entityNotesStore.toggleNotes"
  >
    <div @mousedown="headerDragStart" class="alignRow split notesHeader">
      <label class="labelText ml-8">Notes</label>
      <div class="alignRow">
        <SaveStateIcon
          :state="entityNotesStore.saveState"
          subject="Notes"
          class="mr-8"
        ></SaveStateIcon>
        <BaseButton
          v-if="pipEnabled"
          @click="enablePip"
          icon="pip"
        ></BaseButton>
        <BaseButton
          @click="entityNotesStore.toggleNotes"
          icon="close"
        ></BaseButton>
      </div>
    </div>
    <EntityNotesTextEditor
      :editorFocus="state.editorFocus"
      id="entity-notes-editor"
    ></EntityNotesTextEditor>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { computed, onBeforeMount, onMounted, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import SaveStateIcon from "../Base/SaveStateIcon.vue";
import type { SaveState } from "vennt-library";
import EntityNotesTextEditor from "./EntityNotesTextEditor.vue";
import { useEntityNotesStore } from "@/stores/entityNotes";

interface EntityNotesState {
  boxHeight: number;
  startMouseY: number;
  startBoxHeight: number;
  editorFocus: number;
  saveState: SaveState;
}

const state = reactive<EntityNotesState>({
  boxHeight: 200,
  startMouseY: 0,
  startBoxHeight: 0,
  editorFocus: 0,
  saveState: "SAVED",
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

onMounted(() => {
  setTimeout(() => {
    state.editorFocus++;
  }, 0);
});

const entityStore = useEntityStore();
const entityNotesStore = useEntityNotesStore();
const pipEnabled = document.pictureInPictureEnabled;

const localStorageId = computed(() => entityStore.entity?.entity.id + "-nh");

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
    window.innerHeight,
  );
};

const endDrag = () => {
  document.onmouseup = null;
  document.onmousemove = null;
  localStorage.setItem(localStorageId.value, state.boxHeight.toString());
};

const enablePip = async () => {
  const editor = document.getElementById("entity-notes-editor");
  if (editor) {
    // @ts-ignore documentPictureInPicture test
    const res = await window.documentPictureInPicture.requestWindow({
      initialAspectRatio: 1,
      lockAspectRatio: false,
      copyStyleSheets: true,
    });
    console.log(res);
    res.document.body.append(editor);
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
.notesCard :deep(.editor-wrapper) {
  background-color: unset;
  border: none;
  height: 100%;
  overflow-y: auto;
}
.notesCard :deep(.full-editor-wrapper),
.notesCard :deep(.ProseMirror) {
  height: calc(100% - 46px);
}
</style>
