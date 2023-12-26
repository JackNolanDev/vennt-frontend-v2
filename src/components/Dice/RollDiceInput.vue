<template>
  <div class="card column">
    <slot name="title"></slot>
    <ToggleableDiceSection
      :dice="dice"
      @roll-value="(value) => emits('update:modelValue', value.toString())"
    ></ToggleableDiceSection>
    <div class="separator thin mt-8"></div>
    <div class="m-8">
      <div class="alignRow gap">
        <label :for="`roll-value-${unique}`" class="labelText nowrap">
          Roll value:
        </label>
        <input
          type="number"
          :placeholder="inputPlaceholder"
          :value="modelValue"
          @input="emitManualType"
          :id="`roll-value-${unique}`"
          class="input"
        />
      </div>
      <slot name="innerForm"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiceCommands } from "vennt-library";
import ToggleableDiceSection from "./ToggleableDiceSection.vue";

const unique = Math.random().toString().substring(2);

defineProps<{
  dice: DiceCommands;
  modelValue: string;
  inputPlaceholder?: string;
}>();

const emits = defineEmits<{ (e: "update:modelValue", state: string): void }>();

const emitManualType = (payload: Event) => {
  // @ts-expect-error ts doesn't like e.target.value
  emits("update:modelValue", payload.target.value);
};
</script>
