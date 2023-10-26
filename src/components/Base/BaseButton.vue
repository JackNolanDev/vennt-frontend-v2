<template>
  <RouterLink v-if="to" :to="to" class="btn basicBtn">
    <BaseButtonContents :icon="icon">
      <template #customIcon><slot name="customIcon"></slot></template>
      <template #default><slot></slot></template>
    </BaseButtonContents>
  </RouterLink>
  <button v-else type="button" class="btn basicBtn" @click="btnClicked">
    <div v-if="clickedNote && state.clicked" class="btn-temp-note">
      {{ clickedNote }}
    </div>
    <BaseButtonContents :icon="icon">
      <template #customIcon><slot name="customIcon"></slot></template>
      <template #default><slot></slot></template>
    </BaseButtonContents>
  </button>
</template>

<script setup lang="ts">
import { type RouteLocationRaw, RouterLink } from "vue-router";
import BaseButtonContents from "./BaseButtonContents.vue";
import { reactive } from "vue";

const state = reactive({ clicked: false });
const props = defineProps<{
  icon?: string;
  to?: RouteLocationRaw;
  clickedNote?: string;
}>();

const btnClicked = () => {
  if (!props.clickedNote) {
    return;
  }
  state.clicked = true;
  setTimeout(() => {
    state.clicked = false;
  }, 3_000);
};
</script>

<style scoped>
/*
Button styles:
* "selected" highlights given icon
* "skinny" decreases the button's margin
* "center" centers text
* "left" moves text and icon to the left side
* "bold" makes text larger and bold
* "bolder" makes text larger and more bold
* "wide" makes button wide
* "primary" makes button primary
* "secondary" makes button a different color
* "clear" makes button same color as primary but with clear interior

*/
.basicBtnContents {
  margin: 6px;
}
.skinny > .basicBtnContents {
  margin: 2px;
}
.center {
  justify-content: center;
}
.bold > .basicBtnContents {
  font-weight: 500;
  font-size: 18pt;
}
.bolder > .basicBtnContents {
  font-weight: 700;
  font-size: 18pt;
}
.left {
  justify-content: flex-end;
}
.left > .basicBtnContents {
  flex-direction: row-reverse;
}
.btn {
  border: solid var(--button-border-width) transparent;
  position: relative;
}
.btn.wide {
  width: calc(100% - 2 * var(--button-border-width));
}
.basicBtn:hover:not(:disabled) {
  background-color: rgba(75, 74, 103, 0.2);
}
.basicBtn:active:not(:disabled) {
  background-color: rgba(75, 74, 103, 0.4);
}
.primary {
  background-color: var(--main-button);
  border: solid var(--button-border-width) var(--main-button);
  font-weight: 500;
}
.primary:disabled {
  background-color: var(--main-button-disabled);
  border: solid var(--button-border-width) var(--main-button-disabled);
  color: var(--text-contrast);
}
.primary:hover:not(:disabled) {
  background-color: var(--main-button-hover);
  border: solid var(--button-border-width) var(--main-button-hover);
}
.primary:active:not(:disabled) {
  background-color: var(--main-button-active);
  border: solid var(--button-border-width) var(--main-button-active);
}
.secondary {
  background-color: var(--secondary-button);
  border: solid var(--button-border-width) var(--secondary-button);
  font-weight: 500;
}
.secondary:disabled {
  background-color: var(--secondary-button-disabled);
  border: solid var(--button-border-width) var(--secondary-button-disabled);
  color: var(--text-contrast);
}
.secondary:hover:not(:disabled) {
  background-color: var(--secondary-button-hover);
  border: solid var(--button-border-width) var(--secondary-button-hover);
}
.secondary:active:not(:disabled) {
  background-color: var(--secondary-button-active);
  border: solid var(--button-border-width) var(--secondary-button-active);
}
.clear {
  border: solid var(--button-border-width) var(--main-button);
  color: var(--main-button);
  font-weight: 500;
}
.clear:disabled {
  opacity: 0.65;
  color: var(--main-button-disabled);
  background-color: transparent;
}
.clear:hover:not(:disabled) {
  background-color: var(--main-button-hover);
  border: solid var(--button-border-width) var(--main-button-hover);
  color: var(--text-contrast);
}
.clear:active:not(:disabled) {
  background-color: var(--main-button-active);
  border: solid var(--button-border-width) var(--main-button-active);
  color: var(--text-contrast);
}

.outline-on-hover:hover {
  border-radius: 2px;
  outline-style: solid;
  outline-color: var(--border-focus);
  outline-width: 3px;
  z-index: 2;
}

/* TODO: Would be cool if this faded out https://vuejs.org/guide/built-ins/transition.html#the-transition-component */
.btn-temp-note {
  position: absolute;
  bottom: 100%;
  padding: 8px;
  color: var(--text);
  background: var(--background-high-contrast);
  border-radius: var(--border-radius);
  --btn-temp-note-width: 80px;
  width: var(--btn-temp-note-width);
  margin-left: calc((100% / 2) - ((var(--btn-temp-note-width) + 16px) / 2));
}
.btn-temp-note::after {
  content: "";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--background-high-contrast) transparent transparent
    transparent;
}
</style>
