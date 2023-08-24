<template>
  <div>
    <BaseButton
      v-if="useGivenState ? givenClosed : state.closed"
      @click="toggleDropDown"
      :disabled="disabled"
      icon="keyboard_arrow_right"
      class="wide"
    >
      <slot name="closedTitle"></slot>
      {{ title }}
    </BaseButton>
    <div v-else class="card column">
      <BaseButton
        @click="toggleDropDown"
        :disabled="disabled"
        icon="keyboard_arrow_down"
        class="wide"
      >
        <slot name="openTitle"></slot>
        {{ title }}
      </BaseButton>
      <div class="separator thin"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps<{
  defaultOpen?: boolean;
  useGivenState?: boolean;
  givenClosed?: boolean;
  disabled?: boolean;
  title?: string;
}>();
const defaultState = () => ({ closed: !props.defaultOpen });
const state = reactive(defaultState());

const emit = defineEmits<{ (e: "change", state: boolean): void }>();

const toggleDropDown = () => {
  if (!props.useGivenState) {
    state.closed = !state.closed;
  }
  emit("change", !props.givenClosed);
};
</script>
