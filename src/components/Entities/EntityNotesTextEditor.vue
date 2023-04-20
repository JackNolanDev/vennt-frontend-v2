<template>
  <BaseFullFeaturedTextEditor
    v-model="entityNotesStore.liveNotes"
    @update:modelValue="entityNotesStore.typing"
    placeholder="write your notes here"
    :focusOnChange="editorFocus"
    class="notes-editor"
  ></BaseFullFeaturedTextEditor>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import BaseFullFeaturedTextEditor from "../Base/BaseFullFeaturedTextEditor.vue";
import { useEntityNotesStore } from "@/stores/entityNotes";

defineProps<{ editorFocus?: number }>();

const entityNotesStore = useEntityNotesStore();

onBeforeUnmount(() => {
  entityNotesStore.saveNotes();
});
</script>

<style scoped>
.notes-editor :deep(p) {
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
