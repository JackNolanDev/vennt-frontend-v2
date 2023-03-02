<template>
  <AbilityComment :ability="ability"></AbilityComment>
  <UseAbilitySection :ability="ability"></UseAbilitySection>
  <div class="separator mt-16 mb-16"></div>
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
import AbilityComment from "./AbilityComment.vue";
import { useEntityStore } from "@/stores/entity";
import ConfirmationModal from "../Base/ConfirmationModal.vue";
import type { FullEntityAbility } from "@/utils/backendTypes";
import UseAbilitySection from "./UseAbilitySection.vue";

const props = defineProps<{ ability: FullEntityAbility }>();
const entityStore = useEntityStore();

const deleteAbility = () => {
  entityStore.deleteAbility(props.ability.id, true);
};
</script>
