<template>
  <BaseLayout :class="{ 'prefers-sidebar': showSection('prefers-sidebar') }">
    <template #nav v-if="showSection('nav')">
      <BaseNav></BaseNav>
    </template>
    <template #sub-nav v-if="showSection('sub-nav')">
      <div class="sub-nav fill-parent">vennt subnav</div>
    </template>
    <template #sidebar v-if="showSection('sidebar')">
      <div class="sidebar fill-parent">vennt sidebar</div>
    </template>
    <template #sidebar-right v-if="showSection('sidebar-right')">
      <div class="sidebar-right fill-parent">vennt sidebar right</div>
    </template>
    <PageLayout class="medium">
      <h1>Main content</h1>
      <BaseCheckBoxArray
        :checked="state.checked"
        :options="checkBoxOptions"
      ></BaseCheckBoxArray>
      <h3>Button styles</h3>
      <BaseButton class="primary mb-8">Primary</BaseButton>
      <BaseButton class="secondary mb-8">Secondary</BaseButton>
      <BaseButton class="clear mb-8">Clear</BaseButton>
      <BaseButton class="mb-8">Default</BaseButton>
      <h4>Wide</h4>
      <BaseButton class="primary wide mb-8">Primary</BaseButton>
      <BaseButton class="secondary wide mb-8">Secondary</BaseButton>
      <BaseButton class="clear wide mb-8">Clear</BaseButton>
      <BaseButton class="wide mb-8">Default</BaseButton>
      <h4>Centered</h4>
      <BaseButton class="primary wide center mb-8">Primary</BaseButton>
      <BaseButton class="secondary wide center mb-8">Secondary</BaseButton>
      <BaseButton class="clear wide center mb-8">Clear</BaseButton>
      <BaseButton class="wide center mb-8">Default</BaseButton>
      <h4>Bold</h4>
      <BaseButton class="primary wide center bold mb-8">Primary</BaseButton>
      <BaseButton class="secondary wide center bold mb-8">
        Secondary
      </BaseButton>
      <BaseButton class="clear wide center bold mb-8">Clear</BaseButton>
      <BaseButton class="wide center bold mb-8">Default</BaseButton>
      <div class="seperator"></div>
      <h2>Cards & Buttons</h2>
      <BaseButton class="wide">Test</BaseButton>
      <div class="card column padded">
        <p>Hello world:</p>
        <BaseButton class="wide">Test</BaseButton>
        <BaseButton disabled class="wide">Disabled</BaseButton>
        <div class="card column padded">
          <p>Inner card</p>
          <BaseButton class="wide">Test</BaseButton>
        </div>
      </div>
      <div class="seperator mt-16 mb-16"></div>
      <h2>Text Editors</h2>
      <label :for="INLINE_EDITOR_ID" @click="focusToInlineEditor">
        Do labels works? (no)
      </label>
      <BaseInlineTextEditor
        v-model="state.inlineText"
        placeholder="Example Text"
        :editorId="INLINE_EDITOR_ID"
        :invalid="state.inlineText.length > 30"
      ></BaseInlineTextEditor>
      {{ state.inlineText }}
      <BaseButton @click="focusToInlineEditor">Jump to editor?</BaseButton>
      <div class="mb-256"></div>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseCheckBoxArray from "@/components/Base/BaseCheckBoxArray.vue";
import BaseInlineTextEditor from "@/components/Base/BaseInlineTextEditor.vue";
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import BaseNav from "@/components/Nav/BaseNav.vue";
import { reactive } from "vue";

const INLINE_EDITOR_ID = "style-inline-editor";

const state = reactive({ checked: new Set<string>(), inlineText: "" });

const showSection = (section: string) => {
  return state.checked.has(section);
};

const checkBoxOptions = {
  nav: "Show nav",
  "sub-nav": "show subnav",
  sidebar: "show left sidebar",
  "sidebar-right": "show right sidebar",
  "prefers-sidebar": "Prefers sidebar",
};

const focusToInlineEditor = () =>
  document.getElementById(INLINE_EDITOR_ID)?.focus();
</script>

<style scoped>
.fill-parent {
  width: 100%;
  height: 100%;
}
.sub-nav {
  background-color: orangered;
}
.sidebar {
  background-color: green;
}
.sidebar-right {
  background-color: darkviolet;
}
</style>
