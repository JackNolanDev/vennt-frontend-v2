<template>
  <SelectAttributeInput
    :options="healAttributeOptions"
    :model-value="modelValue"
    @update:model-value="(attr) => emit('update:modelValue', attr)"
    action="heal"
  ></SelectAttributeInput>
</template>

<script setup lang="ts">
import type { EntityAttribute } from "vennt-library";
import { healableAttributes } from "@/utils/usesUtils";
import { useEntityStore } from "@/stores/entity";
import { computed } from "vue";
import SelectAttributeInput from "./SelectAttributeInput.vue";

defineProps<{ modelValue: EntityAttribute }>();
const emit = defineEmits<{
  (e: "update:modelValue", state: EntityAttribute): void;
}>();
const entityStore = useEntityStore();

const healAttributeOptions = computed(() =>
  healableAttributes(entityStore.computedAttributes),
);
</script>
