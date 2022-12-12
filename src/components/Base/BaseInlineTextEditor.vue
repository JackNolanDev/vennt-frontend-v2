<template>
  <div>
    <BubbleMenu :editor="editor" v-if="editor">
      <div class="alignRow card border">
        <BaseButton
          icon="format_bold"
          @click="editor?.chain().focus().toggleBold().run()"
          :class="{ selected: editor.isActive('bold') }"
        ></BaseButton>
        <BaseButton
          icon="format_italic"
          @click="editor?.chain().focus().toggleItalic().run()"
          :class="{ selected: editor.isActive('italic') }"
        ></BaseButton>
        <BaseButton
          icon="strikethrough_s"
          @click="editor?.chain().focus().toggleStrike().run()"
          :class="{ selected: editor.isActive('strike') }"
        ></BaseButton>
        <BaseButton
          icon="format_underlined"
          @click="editor?.chain().focus().toggleUnderline().run()"
          :class="{ selected: editor.isActive('underline') }"
        ></BaseButton>
      </div>
    </BubbleMenu>
    <EditorContent
      :editor="editor"
      class="editor-wrapper"
      :class="{ invalid }"
    ></EditorContent>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import PlaceHolder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import BaseButton from "./BaseButton.vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    editorId?: string;
    invalid?: boolean;
  }>(),
  {
    modelValue: "",
    placeholder: "",
    invalid: false,
  }
);
const emits = defineEmits<{ (e: "update:modelValue", state: string): void }>();

// TODO: MAY NEED TO WATCH `modelValue` for changes
// https://tiptap.dev/installation/vue3#5-use-v-model

const editorProps: { attributes?: { [name: string]: string } } = {};
if (props.editorId) {
  editorProps.attributes = { id: props.editorId };
}

const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    // inline editor does not need a long history
    History.configure({ depth: 10 }),
    PlaceHolder.configure({ placeholder: props.placeholder }),
    Typography,
    Bold,
    Code,
    Italic,
    Strike,
    Underline,
  ],
  editorProps,
  content: props.modelValue,
  onUpdate: () => {
    if (editor.value) {
      emits("update:modelValue", editor.value.getHTML());
    }
  },
});
</script>

<style>
/* TODO: Move this into base CSS file! */
.editor-wrapper {
  font-family: var(--app-font);
  font-size: 15px;
  line-height: 16px;
  width: 100%;
  border-radius: var(--border-radius);
  color: var(--text);
  background-color: var(--background-highlight);
  border: 1px solid var(--border);
}
.editor-wrapper:hover {
  border: solid 1px var(--border-hover);
}
.editor-wrapper:focus-within {
  border: solid 1px var(--border-focus);
}
.editor-wrapper.invalid {
  border: solid 1px var(--border-error);
}
.editor-wrapper.invalid:hover {
  border: solid 1px var(--border-error-hover);
}
.editor-wrapper.invalid:focus-within {
  border: solid 1px var(--border-error-focus);
}
.ProseMirror:focus {
  outline: none;
}
.editor-wrapper > div > * {
  padding-right: 10px;
  padding-left: 10px;
}
.editor-wrapper > div > *:first-child {
  margin-top: 0;
  padding-top: 12px;
}
.editor-wrapper > div > *:last-child {
  margin-bottom: 0;
  padding-bottom: 12px;
}
/* placeholder text */
.editor-wrapper p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--text-muted);
  pointer-events: none;
  height: 0;
}
</style>
