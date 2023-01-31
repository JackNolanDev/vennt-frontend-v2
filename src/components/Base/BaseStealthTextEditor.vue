<template>
  <div>
    <div v-if="displayOnly">
      <p v-if="placeholder">
        <b>{{ placeholder }}<span v-if="renderPreview">:</span></b>
      </p>
      <div v-if="renderPreview" v-html="renderMarkdown(modelValue)"></div>
    </div>
    <button
      @click="toggleEditor"
      v-else-if="!state.editorOpen"
      class="wide markdown-display"
    >
      <p v-if="placeholder">
        <b>{{ placeholder }}<span v-if="renderPreview">:</span></b>
      </p>
      <div v-if="renderPreview" v-html="renderMarkdown(modelValue)"></div>
      <p v-else-if="!placeholder && !renderPreview">
        <b>Click to edit</b>
      </p>
    </button>
    <div v-else>
      <BaseFullFeaturedTextEditor
        :model-value="modelValue"
        :placeholder="placeholder"
        :editor-id="editorId"
        :invalid="invalid"
        @update:model-value="(e) => emits('update:modelValue', e)"
      ></BaseFullFeaturedTextEditor>
      <div v-if="saveButton" class="alignRow gap end mt-4">
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
import { renderMarkdown } from "@/utils/textUtils";
import BaseFullFeaturedTextEditor from "./BaseFullFeaturedTextEditor.vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    editorId?: string;
    invalid?: boolean;
    saveButton?: boolean;
    displayOnly?: boolean;
  }>(),
  {
    modelValue: "",
    placeholder: "",
    invalid: false,
    saveButton: false,
    displayOnly: false,
  }
);
const state = reactive({ editorOpen: false });
const emits = defineEmits<{
  (e: "update:modelValue", state: string): void;
  (e: "save"): void;
  (e: "cancel"): void;
}>();

const renderPreview = computed(
  () => props.modelValue && props.modelValue !== "<p></p>"
);

const toggleEditor = () => {
  state.editorOpen = !state.editorOpen;
};

const save = () => {
  emits("save");
  toggleEditor();
};
const cancel = () => {
  emits("cancel");
  toggleEditor();
};
</script>

<style scoped>
.markdown-display {
  background-color: inherit;
  font: inherit;
  color: inherit;
  text-align: inherit;
  cursor: text;
  display: block;
  border: 0;
  padding: 0;
  margin: 0;
  border-radius: 3px;
}
.markdown-display:hover {
  background-color: rgba(75, 74, 103, 0.2);
}
.markdown-display:active {
  background-color: rgba(75, 74, 103, 0.4);
}
</style>
