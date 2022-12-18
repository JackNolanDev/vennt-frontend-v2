<template>
  <BaseModal
    v-if="entityStore.entity && entityStore.levelsToProcess > 0"
    :hideButtons="true"
    :large="true"
    @closeModal="closeModal"
  >
    <template #title>Level Up to {{ levelToProcess }}</template>
    <div>
      <p class="mt-0">
        Select an attribute to increase for level {{ levelToProcess }}:
      </p>
      <AttributeSelection
        :selected="state.selected"
        :maxChoices="1"
        :disabledChoices="disabledChoices"
        :attrs="entityStore.entityAttributes"
        @selectedUpdated="selectedUpdated"
      ></AttributeSelection>
      <BaseButton
        @click="levelUpButton"
        :disabled="buttonDisabled"
        class="primary wide center bold mt-16"
        >Level Up</BaseButton
      >
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import BaseModal from "../Base/BaseModal.vue";
import { computed, reactive } from "vue";
import { ATTRIBUTES, type BaseEntityAttribute } from "@/utils/backendTypes";
import AttributeSelection from "./AttributeSelection.vue";
import BaseButton from "../Base/BaseButton.vue";
import { adjustAttrsAPI } from "@/utils/attributeUtils";

const state = reactive<{ selected: BaseEntityAttribute[] }>({ selected: [] });
const entityStore = useEntityStore();

const levelToProcess = computed(() => {
  if (entityStore.entity && entityStore.entity.entity.attributes.xp) {
    return (
      Math.floor(entityStore.entity.entity.attributes.xp / 1000) -
      entityStore.levelsToProcess +
      1
    );
  }
  return 0;
});
const disabledChoices = computed(() => {
  return ATTRIBUTES.filter((attr) =>
    entityStore.entity
      ? entityStore.entity.entity.attributes[attr] >
        Math.floor(levelToProcess.value / 2)
      : true
  );
});
const buttonDisabled = computed(() => state.selected.length === 0);

const closeModal = () => {
  state.selected = [];
  entityStore.levelsToProcess -= 1;
};
const selectedUpdated = (selected: BaseEntityAttribute[]) => {
  state.selected = selected;
};
const levelUpButton = () => {
  if (entityStore.entity && state.selected.length > 0) {
    const attrs = { [state.selected[0]]: 1 };
    adjustAttrsAPI(
      entityStore.entity,
      attrs,
      `Level up bonus for level ${levelToProcess.value}`
    );
    closeModal();
  }
};
</script>
