<template>
  <div>
    <div v-if="displayOnly">
      <p v-if="placeholder">
        <b>{{ placeholder }}<span v-if="renderPreview">:</span></b>
      </p>
      <div v-if="renderPreview" v-html="renderMarkdown(modelValue)"></div>
    </div>
    <div
      v-else-if="!state.editorOpen"
      tabindex="0"
      @dblclick="openEditor"
      @keyup.enter="openEditor"
      @keyup.space="openEditor"
      class="wide markdown-display"
    >
      <p v-if="placeholder">
        <b>{{ placeholder }}<span v-if="renderPreview">:</span></b>
      </p>
      <div v-if="renderPreview" v-html="renderMarkdown(modelValue)"></div>
      <p v-else-if="!placeholder && !renderPreview">
        <b>Double click to edit</b>
      </p>
    </div>
    <div v-else>
      <p v-if="placeholder">
        <b>{{ placeholder }}:</b>
      </p>
      <BaseFullFeaturedTextEditor
        :model-value="modelValue"
        :placeholder="placeholder"
        :editor-id="editorId"
        :invalid="invalid"
        :focus-on-change="state.editorFocus"
        @update:model-value="(e) => emits('update:modelValue', e)"
      ></BaseFullFeaturedTextEditor>
      <div v-if="saveButton" class="alignRow gap end mt-4">
        <ConfirmationModal
          v-if="deleteButton"
          :id="`${editorId}-delete-modal`"
          trigger-icon="delete"
          @main-button="deleteEditor"
        >
          <template #triggerButton>Delete</template>
          <template #title>Delete this {{ deleteSubject }}</template>
          <template #mainButton>Delete {{ deleteSubject }}</template>
          <p class="mt-0 mb-8">
            Are you sure you want to delete this {{ deleteSubject }}?
          </p>
          <div class="card" v-html="renderMarkdown(modelValue)"></div>
        </ConfirmationModal>
        <BaseButton @click="cancel" icon="close" class="clear"
          >Cancel</BaseButton
        >
        <BaseButton @click="save" icon="save" class="primary">Save</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";
import { computed, reactive } from "vue";
import { editorEmpty, renderMarkdown } from "@/utils/textUtils";
import BaseFullFeaturedTextEditor from "./BaseFullFeaturedTextEditor.vue";
import ConfirmationModal from "./ConfirmationModal.vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    editorId?: string;
    invalid?: boolean;
    saveButton?: boolean;
    displayOnly?: boolean;
    deleteButton?: boolean;
    deleteSubject?: string;
  }>(),
  {
    modelValue: "",
    placeholder: "",
  },
);
const state = reactive({ editorOpen: false, editorFocus: 0 });
const emits = defineEmits<{
  (e: "update:modelValue", state: string): void;
  (e: "opened"): void;
  (e: "closed"): void;
  (e: "save"): void;
  (e: "cancel"): void;
  (e: "delete"): void;
}>();

const renderPreview = computed(() => !editorEmpty(props.modelValue));

const openEditor = () => {
  state.editorOpen = true;
  emits("opened");
  // use setTimeout so this code executes after the page is updated
  setTimeout(() => {
    state.editorFocus++;
  }, 0);
};

const closeEditor = () => {
  state.editorOpen = false;
  emits("closed");
};

const save = () => {
  emits("save");
  closeEditor();
};
const cancel = () => {
  emits("cancel");
  closeEditor();
};

const deleteEditor = () => {
  emits("delete");
  closeEditor();
};
</script>

<style scoped>
.markdown-display {
  border-radius: 3px;
  display: inline-block;
}
.markdown-display:hover {
  background-color: rgba(75, 74, 103, 0.2);
}
.markdown-display:active {
  background-color: rgba(75, 74, 103, 0.4);
}
</style>
