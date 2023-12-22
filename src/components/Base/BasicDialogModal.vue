<template>
  <dialog :id="id" @click="modalClick" :class="{ lg: isLarge }">
    <div class="dialogue-content">
      <div class="alignRow split dialogue-title">
        <h2 class="mt-16 mb-16"><slot name="title"></slot></h2>
        <BaseButton @click="closeModal" icon="close" autofocus></BaseButton>
      </div>
      <div class="separator thin"></div>
      <div class="dialogue-details-wrapper">
        <div class="dialogue-details">
          <slot></slot>
        </div>
      </div>
      <div v-if="!hideButtons">
        <div class="separator thin"></div>
        <div class="alignRow end gap wrap dialogue-details">
          <slot name="buttons"></slot>
          <BaseButton @click="closeModal" class="clear">Cancel</BaseButton>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

const props = defineProps<{
  id: string;
  isLarge?: boolean;
  hideButtons?: boolean;
}>();
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
.dialogue-details-wrapper {
  max-height: 560px;
  overflow-y: auto;
}

.dialogue-details-wrapper.lg {
  max-height: 720px;
}

dialog.lg {
  width: 800px;
}

/* Fullscreen Modal when lg */
@media screen and (max-width: 500px), screen and (max-height: 400px) {
  dialog.lg {
    min-width: 100vw;
    min-height: 100vh;
    margin: 0px;
    border: 0px;
    border-radius: 0px;
  }
}
</style>
