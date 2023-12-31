<template>
  <select
    :value="modelValue"
    @input="
      (e) =>
        emit(
          'update:modelValue',
          // @ts-expect-error ts doesn't like e.target.value
          e.target.value,
        )
    "
    title="inputTitle"
    class="input"
  >
    <option v-for="[key, text] in TIME_CHOICES" :key="key" :value="key">
      {{ text }}
    </option>
  </select>
</template>

<script setup lang="ts">
import type { UsesAdjust } from "vennt-library";

defineProps<{
  modelValue: UsesAdjust["time"] | "";
}>();
const emit = defineEmits<{
  (e: "update:modelValue", state: UsesAdjust["time"] | ""): void;
}>();

const TIME_CHOICES: Array<[UsesAdjust["time"] | "", string]> = [
  ["", "(Unset)"],
  ["permanent", "Permanent - Permanent adjustment"],
  ["rest", "Act - Lasts for an Act"],
  ["encounter", "Scene - Lasts for a Scene (e.g. an encounter)"],
  ["turn", "Turn - Lasts until your next turn"],
];
</script>
