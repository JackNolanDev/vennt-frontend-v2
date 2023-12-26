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
    title="Select attribute to heal"
    class="input"
  >
    <option value="">(Unset)</option>
    <option v-for="attr in healAttributeOptions" :key="attr" :value="attr">
      {{ attrShortName(attr) }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { attrShortName, type EntityAttribute } from "vennt-library";
import { healableAttributes } from "@/utils/usesUtils";
import { useEntityStore } from "@/stores/entity";
import { computed } from "vue";

defineProps<{ modelValue: EntityAttribute }>();
const emit = defineEmits<{
  (e: "update:modelValue", state: EntityAttribute): void;
}>();
const entityStore = useEntityStore();

const healAttributeOptions = computed(() =>
  healableAttributes(entityStore.computedAttributes),
);
</script>
