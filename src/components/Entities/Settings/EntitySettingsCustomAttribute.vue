<template>
  <ConfirmationModal
    @main-button="saveAttr"
    @exit-modal="resetState"
    id="entity-add-custom-attribute"
    triggerClass="wide"
    :mainButtonDisabled="creationDisabled"
  >
    <template #triggerButton>Add custom attribute</template>
    <template #title>Add a Custom Attribute</template>
    <template #mainButton>Save new attribute</template>
    <div class="cols-2 center-items">
      <label for="entity-add-custom-attribute-field" class="labelText no-wrap">
        Attribute Name:
      </label>
      <input
        type="text"
        id="entity-add-custom-attribute-field"
        autocapitalize="none"
        v-model="state.attr"
        class="input mt-4 wide"
        :class="{ invalid: attrInvalid }"
      />
    </div>
    <p v-if="attrInvalid" class="mt-8 mb-0 errorText">
      {{ attrInvalid }}
    </p>
    <div class="cols-2 center-items">
      <label for="entity-add-custom-attribute-value" class="labelText no-wrap">
        Initial Value:
      </label>
      <input
        type="number"
        id="entity-add-custom-attribute-value"
        placeholder="0"
        v-model.number="state.val"
        class="input mt-4 wide"
        :class="{ invalid: valInvalid }"
      />
    </div>
    <p v-if="valInvalid" class="mt-8 mb-0 errorText">
      {{ valInvalid }}
    </p>
    <p>Displays as: {{ attrFullName(state.attr) }}</p>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import ConfirmationModal from "@/components/Base/ConfirmationModal.vue";
import {
  attributeNameValidator,
  attributeValValidator,
} from "@/utils/backendTypes";
import { fieldValidator } from "@/utils/inputType";
import { attrFullName } from "@/utils/attributeUtils";
import { computed, reactive } from "vue";
import { useEntityStore } from "@/stores/entity";

const entityStore = useEntityStore();
const state = reactive<{ attr: string; val: string | number }>({
  attr: "",
  val: 0,
});

const attrInvalid = computed(() => {
  return fieldValidator(attributeNameValidator, state.attr, "");
});

const valInvalid = computed(() => {
  return fieldValidator(attributeValValidator, state.val, "");
});

const creationDisabled = computed(() =>
  Boolean(
    attrInvalid.value ||
      state.attr === "" ||
      valInvalid.value ||
      typeof state.val === "string"
  )
);

const saveAttr = async () => {
  if (entityStore.entity && typeof state.val === "number") {
    await entityStore.updateEntityAttributes(entityStore.entity.entity.id, {
      attributes: { [state.attr]: state.val },
      message: `Initial Value for ${state.attr} is ${state.val}`,
    });
  }
  resetState();
};

const resetState = () => {
  state.attr = "";
  state.val = 0;
};
</script>
