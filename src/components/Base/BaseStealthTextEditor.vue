<template>
  <div>
    <button
      @click="toggleEditor"
      v-if="!state.editorOpen"
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
      <div class="alignRow"></div>
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
      <BaseButton
        v-if="saveButton"
        @click="saveButton"
        icon="save"
        class="primary wide"
        >Save</BaseButton
      >
    </div>
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
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Heading from "@tiptap/extension-heading";
import Gapcursor from "@tiptap/extension-gapcursor";
import Dropcursor from "@tiptap/extension-dropcursor";
import BaseButton from "./BaseButton.vue";
import { computed, reactive } from "vue";
import { renderMarkdown } from "@/utils/textUtils";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    editorId?: string;
    invalid?: boolean;
    saveButton?: boolean;
  }>(),
  {
    modelValue: "",
    placeholder: "",
    invalid: false,
    saveButton: false,
  }
);
const state = reactive({ editorOpen: false });
const emits = defineEmits<{
  (e: "update:modelValue", state: string): void;
  (e: "save"): void;
}>();

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
    History.configure({ depth: 50 }),
    PlaceHolder.configure({ placeholder: props.placeholder }),
    Typography,
    Bold,
    Code,
    Italic,
    Strike,
    Underline,
    BulletList,
    OrderedList,
    ListItem,
    CodeBlock,
    HorizontalRule,
    Heading,
    Gapcursor,
    Dropcursor,
    Blockquote,
  ],
  editorProps,
  content: props.modelValue,
  onUpdate: () => {
    if (editor.value) {
      emits("update:modelValue", editor.value.getHTML());
    }
  },
});

const renderPreview = computed(
  () => props.modelValue && props.modelValue !== "<p></p>"
);

const toggleEditor = () => {
  state.editorOpen = !state.editorOpen;
};

const saveButton = () => {
  emits("save");
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
