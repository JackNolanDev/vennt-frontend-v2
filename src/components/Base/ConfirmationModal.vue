<template>
  <BaseButton @click="openDialog" :icon="triggerIcon" :class="triggerClass">
    <slot name="triggerButton"></slot>
  </BaseButton>
  <BasicDialogModal @close-modal="emit('exitModal')" :id="id">
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #buttons>
      <BaseButton
        v-if="!noMainButton"
        @click="mainButton"
        class="primary"
        :disabled="mainButtonDisabled"
      >
        <slot name="mainButton"></slot>
      </BaseButton>
    </template>
    <template #default>
      <slot></slot>
    </template>
  </BasicDialogModal>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";
import BasicDialogModal from "./BasicDialogModal.vue";

const props = defineProps<{
  id: string;
  triggerClass?: string;
  triggerIcon?: string;
  noMainButton?: boolean;
  mainButtonDisabled?: boolean;
}>();
const emit = defineEmits<{
  (e: "mainButton"): void;
  (e: "openModal"): void;
  (e: "exitModal"): void;
}>();

const openDialog = () => {
  const dialog = document.getElementById(props.id) as HTMLDialogElement | null;
  dialog?.showModal();
  emit("openModal");
};

const mainButton = () => {
  const dialog = document.getElementById(props.id) as HTMLDialogElement | null;
  dialog?.close();
  emit("mainButton");
};
</script>
