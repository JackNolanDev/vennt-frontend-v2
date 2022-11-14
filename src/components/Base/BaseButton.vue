<template>
  <RouterLink v-if="props.to" :to="props.to" class="btn basicBtn">
    <div class="basicBtnContents">
      <span v-if="props.icon" class="material-icons space">
        {{ props.icon }}
      </span>
      <span>
        <slot></slot>
      </span>
    </div>
  </RouterLink>
  <button v-else type="button" class="btn basicBtn">
    <div class="basicBtnContents">
      <span v-if="props.icon" class="material-icons space">
        {{ props.icon }}
      </span>
      <span>
        <slot></slot>
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { type RouteLocationRaw, RouterLink } from "vue-router";

const props = defineProps<{ icon?: string; to?: RouteLocationRaw }>();
</script>

<style scoped>
.selected .material-icons {
  color: var(--main-button);
}
.selected.basicBtn:disabled .material-icons {
  color: var(--basic-button-disabled);
}
.center {
  justify-content: center;
}
.bold > .basicBtnContents {
  font-weight: 500;
  font-size: 18pt;
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
