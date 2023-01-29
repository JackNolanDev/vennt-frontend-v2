<template>
  <div v-on:click="closeClick" class="modal show" :id="MODAL_ID">
    <div :class="{ lg: large }" class="dialogue card column">
      <div class="dialogue-content">
        <div class="alignRow split dialogue-title">
          <h2 class="mt-0 mb-0"><slot name="title"></slot></h2>
          <BaseButton
            @click="closeModal"
            icon="close"
            id="modal-first-interactive"
          ></BaseButton>
        </div>
        <div class="separator thin"></div>
        <div class="dialogue-details">
          <slot></slot>
        </div>
        <div v-if="!hideButtons">
          <div class="separator thin"></div>
          <div class="alignRow end gap wrap dialogue-details">
            <slot name="buttons"></slot>
            <BaseButton @click="closeModal" class="clear">Cancel</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import BaseButton from "./BaseButton.vue";

const MODAL_ID = "base-modal";

defineProps<{ hideButtons?: boolean; large?: boolean }>();
const emit = defineEmits<{ (e: "closeModal"): void }>();

onMounted(() => document.getElementById("modal-first-interactive")?.focus());

const closeModal = () => emit("closeModal");
const closeClick = (event: Event) => {
  if (document.getElementById(MODAL_ID) === event.target) {
    closeModal();
  }
};
</script>
