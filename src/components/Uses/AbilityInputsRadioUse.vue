<template>
  <div class="mt-8">
    <BaseRadioButtons
      :options="options"
      :selected="selected"
      @selected-updated="updateSelected"
    ></BaseRadioButtons>
    <AbilityInputsUses
      :ability="ability"
      :inputs="input.choices[selected]"
    ></AbilityInputsUses>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import type {
  FullEntityAbility,
  HTMLString,
  UseRadioInput,
} from "@/utils/backendTypes";
import { computed } from "vue";
import BaseRadioButtons from "../Base/BaseRadioButtons.vue";
import AbilityInputsUses from "./AbilityInputsUse.vue";

const props = defineProps<{
  ability: FullEntityAbility;
  input: UseRadioInput;
}>();

const entityStore = useEntityStore();

const options = computed(() => {
  const options: Record<string, HTMLString> = {};
  Object.keys(props.input.choices).forEach((key) => {
    options[key] = key;
  });
  return options;
});
const selected = computed(() => {
  const keys = props.ability.custom_fields?.keys;
  if (keys) {
    return keys[props.input.key];
  }
  return "";
});

const updateSelected = (selected: string) => {
  const custom_fields = props.ability.custom_fields ?? {};
  if (!custom_fields.keys) {
    custom_fields.keys = {};
  }
  custom_fields.keys[props.input.key] = selected;
  entityStore.updateAbility(props.ability.id, { custom_fields });
};
</script>
