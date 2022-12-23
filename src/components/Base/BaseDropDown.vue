<template>
  <BaseButton
    v-if="(useGivenState && givenClosed) || state.closed"
    @click="toggleDropDown"
    :disabled="disabled"
    icon="keyboard_arrow_down"
    class="wide"
  >
    <slot name="closedTitle"></slot>
  </BaseButton>
  <div v-else class="card column">
    <BaseButton
      @click="toggleDropDown"
      :disabled="disabled"
      icon="keyboard_arrow_up"
      class="wide"
    >
      <slot name="openTitle"></slot>
    </BaseButton>
    <div class="seperator thin"></div>
    <slot></slot>
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
}>();
const state = reactive({ closed: !props.defaultOpen });

const emit = defineEmits<{ (e: "change", state: boolean): void }>();

const toggleDropDown = () => {
  if (props.useGivenState) {
    emit("change", !props.givenClosed);
  } else {
    state.closed = !state.closed;
  }
};
</script>
