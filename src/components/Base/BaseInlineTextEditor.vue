<template>
  <div>
    <BubbleMenu :editor="editor" v-if="editor">
      <div class="alignRow card border">
        <BaseButton
          icon="format_bold"
          @click="editor?.chain().focus().toggleBold().run()"
          title="Format Bold"
          :class="{ selected: editor.isActive('bold') }"
        ></BaseButton>
        <BaseButton
          icon="format_italic"
          @click="editor?.chain().focus().toggleItalic().run()"
          title="Format Italic"
          :class="{ selected: editor.isActive('italic') }"
        ></BaseButton>
        <BaseButton
          icon="strikethrough_s"
          @click="editor?.chain().focus().toggleStrike().run()"
          title="Format Strikethrough"
          :class="{ selected: editor.isActive('strike') }"
        ></BaseButton>
        <BaseButton
          icon="format_underlined"
          @click="editor?.chain().focus().toggleUnderline().run()"
          title="Format Underline"
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
</script>
