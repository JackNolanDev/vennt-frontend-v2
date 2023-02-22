<template>
  <h2>{{ ability.name }}</h2>
  <DisplayAbilityFull :ability="ability"></DisplayAbilityFull>
  <AbilityAdditionalDetailDropdown
    :ability="ability"
    class="mt-16"
  ></AbilityAdditionalDetailDropdown>
  <div v-if="entityStore.canEdit">
    <AbilityComment :ability="ability"></AbilityComment>
    <div class="separator mt-16 mb-16"></div>
    <BaseButton @click="deleteAbility" icon="delete_outline" class="wide">
      Delete Ability
    </BaseButton>
    <ConfirmationModal
      trigger-class="clear wide center"
      id="delete-ability-modal"
      @main-button="deleteAbility"
    >
      <template #triggerButton>Delete Ability</template>
      <template #mainButton>Delete Ability</template>
      <template #title>Delete Ability</template>
      <p class="mt-0 mb-0">
        Are you sure you want to delete this ability? If this has custom data,
        it will be unrecoverable.
      </p>
    </ConfirmationModal>
  </div>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import DisplayAbilityFull from "./DisplayAbilityFull.vue";
import AbilityAdditionalDetailDropdown from "./AbilityAdditionalDetailDropdown.vue";
import AbilityComment from "./AbilityComment.vue";
import { useEntityStore } from "@/stores/entity";
import BaseButton from "../Base/BaseButton.vue";
import ConfirmationModal from "../Base/ConfirmationModal.vue";

const props = defineProps<{ ability: FullEntityAbility }>();
const entityStore = useEntityStore();

const deleteAbility = () => {
  entityStore.deleteAbility(props.ability.id, true);
};
</script>
