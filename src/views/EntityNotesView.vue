<template>
  <div class="entity-notes-page">
    <div class="alignRow split notesHeader">
      <h2>Notes</h2>
      <div class="alignRow">
        <SaveStateIcon
          :state="entityNotesStore.saveState"
          subject="Notes"
          class="mr-8"
        ></SaveStateIcon>
      </div>
    </div>
    <div class="notes-wrapper">
      <EntityNotesTextEditor></EntityNotesTextEditor>
    </div>
  </div>
</template>

<script setup lang="ts">
import SaveStateIcon from "@/components/Base/SaveStateIcon.vue";
import EntityNotesTextEditor from "@/components/Entities/EntityNotesTextEditor.vue";
import { useEntityNotesStore } from "@/stores/entityNotes";

const entityNotesStore = useEntityNotesStore();
</script>

<style scoped>
.entity-notes-page {
  height: var(--page-height);
}
.notes-wrapper,
.notes-wrapper :deep(.full-editor-wrapper),
.notes-wrapper :deep(.editor-wrapper),
.notes-wrapper :deep(.ProseMirror) {
  height: 100%;
}
</style>
