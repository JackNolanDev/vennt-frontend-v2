<template>
  <BaseDropDown v-if="entityStore.entity" title="Dangerous Settings">
    <div class="mt-8 mb-8 ml-8 mr-8">
      <p class="mt-0"><b>WARNING: These settings are dangerous!</b></p>
      <BaseButton @click="updateEntityAbilities" class="primary wide mb-8"
        >Use latest version of all abilities</BaseButton
      >
      <ConfirmationModal
        trigger-class="clear wide"
        id="delete-entity-modal"
        @main-button="entityStore.deleteEntity()"
      >
        <template #triggerButton>
          Delete {{ entityStore.entity.entity.name }}
        </template>
        <template #mainButton>Delete Permanently</template>
        <template #title>
          Delete {{ entityStore.entity.entity.name }} permanently?
        </template>
        <p class="mt-0 mb-0">
          WARNING: If you delete delete {{ entityStore.entity.entity.name }},
          they will be gone forever, along with all of their abilities, items,
          notes, backstory, etc. There is no way to recover them.
        </p>
      </ConfirmationModal>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { findNewAbilityVersion } from "@/utils/abilityUtils";
import BaseDropDown from "../../Base/BaseDropDown.vue";
import ConfirmationModal from "../../Base/ConfirmationModal.vue";

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

const updateEntityAbilities = async () => {
  if (!entityStore.entity) {
    return;
  }
  const abilitiesToUpdate = entityStore.entity.abilities.map((ability) => ({
    id: ability.id,
    update: findNewAbilityVersion(ability, jsonStorage.abilities),
  }));
  for await (const { id, update } of abilitiesToUpdate) {
    if (!update) {
      continue;
    }
    await entityStore.updateAbility(id, update);
  }
};
</script>
