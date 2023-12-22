<template>
  <PageLayout>
    <div class="alignRow split">
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
  </PageLayout>
</template>

<script setup lang="ts">
import SaveStateIcon from "@/components/Base/SaveStateIcon.vue";
import EntityNotesTextEditor from "@/components/Entities/EntityNotesTextEditor.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import { useEntityNotesStore } from "@/stores/entityNotes";

const entityNotesStore = useEntityNotesStore();
</script>
