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
    :title="inputTitle"
    class="input"
  >
    <option value="">(Unset)</option>
    <option v-for="attr in options" :key="attr" :value="attr">
      {{ attrShortName(attr) }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { attrShortName, type EntityAttribute } from "vennt-library";
import { computed } from "vue";

const props = defineProps<{
  modelValue: EntityAttribute;
  options: EntityAttribute[];
  action?: "heal" | "adjust";
}>();
const emit = defineEmits<{
  (e: "update:modelValue", state: EntityAttribute): void;
}>();

const inputTitle = computed(() => {
  if (props.action) {
    return `Select attribute to ${props.action}`;
  }
  return "Select attribute";
});
</script>
