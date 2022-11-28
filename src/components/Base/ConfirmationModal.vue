<template>
  <BaseButton @click="openDialog" :class="triggerClass">
    <slot name="triggerButton"></slot>
  </BaseButton>
  <BasicDialogModal :id="id">
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #buttons>
      <BaseButton @click="mainButton" class="primary">
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

const props = defineProps<{ id: string; triggerClass?: string }>();
const emit = defineEmits<{ (e: "mainButton"): void }>();

const openDialog = () => {
  const dialog = document.getElementById(props.id) as HTMLDialogElement;
  dialog.showModal();
};

const mainButton = () => {
  const dialog = document.getElementById(props.id) as HTMLDialogElement;
  dialog.close();
  emit("mainButton");
};
</script>
