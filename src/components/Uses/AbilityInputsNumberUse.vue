<template>
  <div class="mt-8">
    <label :for="id" class="labelText">{{ input.label ?? input.key }}</label>
    <input
      type="number"
      v-model="state.input"
      :id="id"
      :min="solveVal(input.min)"
      :max="solveVal(input.max)"
      class="input wide mt-4"
    />
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
import {
  solveEquation,
  type FullEntityAbility,
  type UseNumberInput,
} from "vennt-library";
import { computed, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{
  ability: FullEntityAbility;
  input: UseNumberInput;
}>();
const entityStore = useEntityStore();

const id = computed(() => `input-${props.input.key}`);
const defaultState = computed(() => {
  const keys = props.ability.custom_fields?.keys;
  if (keys) {
    return keys[props.input.key];
  }
  const def = props.input.default;
  return typeof def === "number" ? def.toString() : def ?? "";
});

const state = reactive({ input: defaultState.value });

const saveButtonDisabled = computed(() => defaultState.value === state.input);

const solveVal = (val?: string | number) => {
  return typeof val === "string"
    ? solveEquation(val, entityStore.computedAttributes)
    : val;
};

const saveButton = () => {
  const custom_fields = props.ability.custom_fields ?? {};
  if (!custom_fields.keys) {
    custom_fields.keys = {};
  }
  custom_fields.keys[props.input.key] = state.input.toString();
  entityStore.updateAbility(props.ability.id, { custom_fields });
};
</script>
