<template>
  <ConfirmationModal
    v-if="entityStore.entity?.entity.other_fields.disabled_actions"
    :id="MODAL_ID"
    :no-main-button="true"
    triggerClass="wide"
  >
    <template #triggerButton>Edit Disabled Actions</template>
    <template #title>Remove disabled actions</template>
    <div
      v-if="
        Object.keys(entityStore.entity.entity.other_fields.disabled_actions)
          .length > 0
      "
    >
      <div
        v-for="(details, action) in entityStore.entity.entity.other_fields
          .disabled_actions"
        :key="action"
      >
        <div v-if="details.length > 0">
          <p class="mt-0 mb-0 label-text">{{ action }}</p>
          <ul>
            <li v-for="({ msg }, idx) in details" :key="msg + idx">
              <div class="alignRow split">
                <span>{{ msg }}</span>
                <BaseButton
                  icon="delete"
                  title="Remove this disabled action reason"
                  @click="removeDisabledAction(action, idx)"
                ></BaseButton>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <p v-else>No disabled actions to remove</p>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import ConfirmationModal from "@/components/Base/ConfirmationModal.vue";
import { useEntityStore } from "@/stores/entity";
import type { DisabledActions } from "vennt-library";

const MODAL_ID = "entity-update-disabled-actions";

const entityStore = useEntityStore();

const removeDisabledAction = (action: string, idx: number) => {
  if (!entityStore.entity?.entity.other_fields.disabled_actions) {
    return;
  }

  const existingArray =
    entityStore.entity?.entity.other_fields.disabled_actions[action];
  const newDisabledActions: DisabledActions = {
    ...entityStore.entity?.entity.other_fields.disabled_actions,
  };
  if (existingArray.length <= 1) {
    delete newDisabledActions[action];
  } else {
    newDisabledActions[action] = existingArray.slice(idx, idx + 1);
  }

  entityStore.updateEntity({
    other_fields: {
      ...entityStore.entity.entity.other_fields,
      disabled_actions: newDisabledActions,
    },
  });
};
</script>
