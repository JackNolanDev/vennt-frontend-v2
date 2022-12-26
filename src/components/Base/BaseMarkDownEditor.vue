<template>
  <div class="editor-wrapper">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input textInput editor-textarea"
    ></textarea>
    <div class="editor-display" v-html="renderMarkdown(modelValue)"></div>
    <!-- Probably better to keep using textarea and figure out a way to hide the content? -->
    <!-- <div
      v-html="renderMarkdown(modelValue, { keepSyntax: true })"
      contenteditable="true"
      class="input textInput"
    ></div> -->
  </div>
</template>

<script setup>
import { renderMarkdown } from "@/utils/textUtils";
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.editor-wrapper {
  display: grid;
  grid-template-areas: "editor";
}
.editor-wrapper > .editor-textarea {
  grid-area: editor;
  color: rgba(0, 0, 0, 0);
}
.editor-wrapper > .editor-display {
  grid-area: editor;
  pointer-events: none;
  padding: 11px 11px 13px 13px;
  line-height: 24px;
  resize: vertical;
  font-family: var(--app-font);
  font-size: 15px;
  letter-spacing: normal;
  word-spacing: normal;
  white-space: pre-wrap;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  text-align: start;
  overflow-wrap: break-word;
}
</style>
