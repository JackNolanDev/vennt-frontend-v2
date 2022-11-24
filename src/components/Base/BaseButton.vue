<template>
  <RouterLink v-if="props.to" :to="props.to" class="btn basicBtn">
    <BaseButtonContents :icon="icon" :bullet="bullet">
      <slot></slot>
    </BaseButtonContents>
  </RouterLink>
  <button v-else type="button" class="btn basicBtn">
    <BaseButtonContents :icon="icon" :bullet="bullet">
      <slot></slot>
    </BaseButtonContents>
  </button>
</template>

<script setup lang="ts">
import type { Entity } from "@/utils/backendTypes";
import { type RouteLocationRaw, RouterLink } from "vue-router";
import BaseButtonContents from "./BaseButtonContents.vue";

const props = defineProps<{
  icon?: string;
  to?: RouteLocationRaw;
  bullet?: Entity | true;
}>();
</script>

<style scoped>
/*
Button styles:
* "selected" highlights given icon
* "skinny" decreases the button's margin
* "center" centers text
* "left" moves text and icon to the left side
* "bold" makes text larger and more bold
* "wide" makes button wide
* "primary" makes button primary
* "secondary" makes button a different color
* "clear" makes button same color as primary but with clear interior

*/
.basicBtnContents {
  margin: 6px;
}
.selected .material-icons {
  color: var(--main-button);
}
.selected.basicBtn:disabled .material-icons {
  color: var(--basic-button-disabled);
}
.skinny > .basicBtnContents {
  margin: 2px;
}
.center {
  justify-content: center;
}
.bold > .basicBtnContents {
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
}
.btn.wide {
  width: calc(100% - 2 * var(--button-border-width));
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
</style>
