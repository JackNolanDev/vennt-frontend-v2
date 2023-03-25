<template>
  <ConfirmationModal
    @main-button="saveName"
    @exit-modal="resetState"
    :id="modalId"
    triggerClass="wide"
  >
    <template #triggerButton>Edit name</template>
    <template #title>Edit "{{ entityStore.entity?.entity.name }}"</template>
    <template #mainButton>Save new name</template>
    <label for="entity-update-name" class="labelText mb-4"
      >Update Character Name</label
    >
    <input
      type="text"
      :placeholder="entityStore.entity?.entity.name"
      v-model="state.name"
      @keyup.enter="saveAndClose"
      class="input"
      id="entity-update-name"
    />
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { reactive } from "vue";
import ConfirmationModal from "../../Base/ConfirmationModal.vue";

const modalId = "entity-update-name-modal";

const entityStore = useEntityStore();
const state = reactive({ name: entityStore.entity?.entity.name ?? "" });

const saveAndClose = () => {
  saveName();
  const dialog = document.getElementById(modalId) as HTMLDialogElement;
  dialog.close();
};

const saveName = () => {
  entityStore.updateEntity({ name: state.name });
};

const resetState = () => {
  state.name = entityStore.entity?.entity.name ?? "";
};
</script>
