<template>
  <BaseDropDown title="Adjusts Attribute Values">
    <div class="m-8">
      <slot name="desc"></slot>
      <div class="cols-2 center-items gap">
        <label for="edit-adjust-uses-time">Time span:</label>
        <EditTimeSpanInput
          :model-value="modelValue.time"
          @update:model-value="
            (time) => emit('update:modelValue', { ...modelValue, time })
          "
          id="edit-adjust-uses-time"
        ></EditTimeSpanInput>
      </div>
      <EditHealUses
        drop-down-title="Attribute Adjustments"
        :model-value="modelValue.adjusts"
        @update:model-value="
          (adjusts) => emit('update:modelValue', { ...modelValue, adjusts })
        "
        for-adjustments
        class="mt-8"
        ><template #desc
          ><p class="mt-0 mb-8">Define attribute adjustments</p></template
        ></EditHealUses
      >
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import type { EditAdjustUses } from "@/utils/usesUtils";
import BaseDropDown from "../Base/BaseDropDown.vue";
import EditHealUses from "./EditHealUses.vue";
import EditTimeSpanInput from "./EditTimeSpanInput.vue";

defineProps<{ modelValue: EditAdjustUses; name?: string }>();
const emit = defineEmits<{
  (e: "update:modelValue", state: EditAdjustUses): void;
}>();
</script>
