<template>
  <BaseFullFeaturedTextEditor
    v-model="entityNotesStore.liveNotes"
    @update:modelValue="entityNotesStore.typing"
    placeholder="write your notes here"
    :focusOnChange="editorFocus"
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
