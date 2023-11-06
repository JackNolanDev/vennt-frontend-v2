<template>
  <ConfirmationModal
    trigger-class="wide"
    trigger-icon="delete_outline"
    id="delete-ability-modal"
    @main-button="deleteAbility"
  >
    <template #triggerButton>Delete Ability</template>
    <template #mainButton>Delete Ability</template>
    <template #title>Delete Ability</template>
    <p class="mt-0 mb-0">
      Are you sure you want to delete this ability? If this has custom data, it
      will be unrecoverable.
    </p>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import type { FullEntityAbility } from "vennt-library";
import ConfirmationModal from "../Base/ConfirmationModal.vue";

const props = defineProps<{ ability: FullEntityAbility }>();
const entityStore = useEntityStore();

const deleteAbility = () => {
  entityStore.deleteAbility(props.ability.id, true);
};
</script>
