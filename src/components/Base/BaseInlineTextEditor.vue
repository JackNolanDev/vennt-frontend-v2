<template>
  <div v-if="editor">
    <BaseBubbleMenu :editor="editor"></BaseBubbleMenu>
    <EditorContent
      :editor="editor"
      class="editor-wrapper"
      :class="{ invalid }"
    ></EditorContent>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
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
import BaseBubbleMenu from "./TextEditors/BaseBubbleMenu.vue";
import { watch } from "vue";

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
  },
);
const emits = defineEmits<{ (e: "update:modelValue", state: string): void }>();

const editorProps: { attributes?: { [name: string]: string } } = {};
if (props.editorId) {
  editorProps.attributes = { id: props.editorId };
}

// TODO: fix this using initialState function
/* eslint-disable vue/no-setup-props-destructure */
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

watch(
  () => props.modelValue,
  () => {
    if (editor.value?.getHTML() === props.modelValue) {
      return;
    }
    editor.value?.commands.setContent(props.modelValue, false);
  },
);
</script>
