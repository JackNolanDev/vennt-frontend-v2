<template>
  <BubbleMenu :editor="editor">
    <div class="alignRow card border">
      <BaseButton
        icon="format_bold"
        @click="editor.chain().focus().toggleBold().run()"
        title="Format Bold"
        :class="{ selected: editor.isActive('bold') }"
      ></BaseButton>
      <BaseButton
        icon="format_italic"
        @click="editor.chain().focus().toggleItalic().run()"
        title="Format Italic"
        :class="{ selected: editor.isActive('italic') }"
      ></BaseButton>
      <BaseButton
        icon="strikethrough_s"
        @click="editor.chain().focus().toggleStrike().run()"
        title="Format Strikethrough"
        :class="{ selected: editor.isActive('strike') }"
      ></BaseButton>
      <BaseButton
        icon="format_underlined"
        @click="editor.chain().focus().toggleUnderline().run()"
        title="Format Underline"
        :class="{ selected: editor.isActive('underline') }"
      ></BaseButton>
    </div>
  </BubbleMenu>
</template>

<script setup lang="ts">
import { Editor, BubbleMenu } from "@tiptap/vue-3";
import BaseButton from "../BaseButton.vue";
defineProps<{ editor: Editor }>();
</script>
