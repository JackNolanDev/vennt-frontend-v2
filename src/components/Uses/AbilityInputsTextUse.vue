<template>
  <div class="mt-8">
    <label :for="id" class="labelText">{{ input.key }}</label>
    <input type="text" v-model="state.input" :id="id" class="input wide mt-4" />
    <BaseButton
      @click="saveButton"
      :disabled="saveButtonDisabled"
      class="wide primary mt-4"
      >Save</BaseButton
    >
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import type { FullEntityAbility, UseTextInput } from "@/utils/backendTypes";
import { computed, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{
  ability: FullEntityAbility;
  input: UseTextInput;
}>();
const entityStore = useEntityStore();

const id = computed(() => `input-${props.input.key}`);
const defaultState = computed(() => {
  const keys = props.ability.custom_fields?.keys;
  if (keys) {
    return keys[props.input.key];
  }
  return "";
});

const state = reactive({ input: defaultState.value });

const saveButtonDisabled = computed(() => defaultState.value === state.input);

const saveButton = () => {
  const custom_fields = props.ability.custom_fields ?? {};
  if (!custom_fields.keys) {
    custom_fields.keys = {};
  }
  custom_fields.keys[props.input.key] = state.input;
  entityStore.updateAbility(props.ability.id, { custom_fields });
};
</script>
