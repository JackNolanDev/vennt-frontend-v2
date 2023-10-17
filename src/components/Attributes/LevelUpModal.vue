<template>
  <BaseModal
    v-if="entityStore.entity && entityStore.levelsToProcess > 0"
    :hideButtons="true"
    :large="true"
    @closeModal="closeModal"
  >
    <template #title>Level Up to {{ attrLevelToProcess }}</template>
    <div v-if="increaseAttrs">
      <p class="mt-0">
        Select an attribute to increase for level {{ attrLevelToProcess }}:
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
    <div v-else>
      <p class="mt-0">Nothing is required for this level up!</p>
      <BaseButton @click="closeModal" class="primary wide center bold mt-16"
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
import { LEVEL_UPS_TO_INCREASE_ATTR } from "@/utils/venntConfig";

const state = reactive<{ selected: BaseEntityAttribute[] }>({ selected: [] });
const entityStore = useEntityStore();

const attrLevelToProcess = computed(() => {
  if (entityStore.entity && entityStore.entityAttributes.xp) {
    return (
      Math.floor(entityStore.entityAttributes.xp.val / 1000) -
      entityStore.levelsToProcess +
      1
    );
  }
  return 0;
});
const increaseAttrs = computed(
  () => attrLevelToProcess.value % LEVEL_UPS_TO_INCREASE_ATTR === 0
);
const disabledChoices = computed(() =>
  ATTRIBUTES.filter((attr) => {
    const found = entityStore.entityAttributes[attr];
    return found ? found.val > Math.floor(attrLevelToProcess.value / 2) : true;
  })
);
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
    adjustAttrsAPI(entityStore.entity, entityStore.entityAttributes, attrs, {
      msg: `Level up bonus for level ${attrLevelToProcess.value}`,
    });
    closeModal();
  }
};
</script>
