<template>
  <dialog :id="id" @click="modalClick">
    <div class="dialogue-content">
      <div class="alignRow split dialogue-title">
        <h2 class="mt-16 mb-16"><slot name="title"></slot></h2>
        <BaseButton @click="closeModal" icon="close"></BaseButton>
      </div>
      <div class="separator thin"></div>
      <div class="dialogue-details">
        <slot></slot>
      </div>
      <div class="separator thin"></div>
      <div class="alignRow end gap wrap dialogue-details">
        <slot name="buttons"></slot>
        <BaseButton @click="closeModal" class="clear">Cancel</BaseButton>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

const props = defineProps<{ id: string }>();
const emit = defineEmits<{ (e: "closeModal"): void }>();

const closeModal = () => {
  const dialog = document.getElementById(props.id) as HTMLDialogElement;
  dialog.close();
  emit("closeModal");
};

const modalClick = (event: Event) => {
  // @ts-ignore
  if (event.target.id === props.id) {
    closeModal();
  }
};
</script>

<style scoped>
dialog {
  width: 500px;
  border: 1px solid var(--border-contrast);
  border-radius: var(--border-radius);
  padding: 0px;
  background-color: var(--background-highlight);
  color: var(--text);
}
dialog::backdrop {
  background: rgba(0, 0, 0, 0.7);
}
</style>
