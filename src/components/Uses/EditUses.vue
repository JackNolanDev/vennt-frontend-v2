<template>
  <BaseDropDown :title="`${displayEditType} Functionality`">
    <div class="m-8">
      <EditRollUse
        :model-value="modelValue.roll"
        @update:model-value="
          (roll) => emit('update:modelValue', { ...modelValue, roll })
        "
        :name="name"
        class="mb-4"
        ><template #desc
          ><p class="mt-0 mb-8">
            Use this section when this {{ displayEditType }} should heal some
            resources based on the result of a dice roll. E.g., heal 2d6+SPI
            Vim.
          </p></template
        ></EditRollUse
      >
      <EditHealUses
        :model-value="modelValue.heal"
        @update:model-value="
          (heal) => emit('update:modelValue', { ...modelValue, heal })
        "
        drop-down-title="Heals / uses resources"
        class="mb-4"
      >
        <template #desc
          ><p class="mt-0 mb-8">
            Use this section when this {{ displayEditType }} should effect an
            attribute's value on use. For example, if this ability heals HP, or
            uses SP, or effects any custom attributes
          </p></template
        >
      </EditHealUses>
      <EditAdjustUses
        :model-value="modelValue.adjust"
        @update:model-value="
          (adjust) => emit('update:modelValue', { ...modelValue, adjust })
        "
        class="mb-4"
      >
        <template #desc
          ><p class="mt-0 mb-8">
            Use this section when this {{ displayEditType }} should effect a
            base attribute's value on use, either permanently or for a set
            period of time. For example, if this {{ displayEditType }} effects
            this character's maximum HP, STR, or Armor.
          </p>
          <p class="mt-0 mb-8">
            NOTE: This will not technically effect the base value of an
            attribute, but will effect the way it is computed as long as the
            effect is active. If you want to permanently effect a value, you
            should use one of the heal functionality options.
          </p></template
        ></EditAdjustUses
      >
      <BaseDropDown title="Edit in JSON">
        <div class="m-8">
          <p class="mt-0 mb-8">
            This section is for manually editing this {{ displayEditType }}'s
            functionality using JSON.
          </p>
          <label class="label-text mb-4">Uses Override</label>
          <textarea
            :value="modelValue.override"
            @input="
              (e) =>
                emit('update:modelValue', {
                  ...modelValue,
                  // @ts-expect-error ts doesn't like e.target.value
                  override: e.target.value,
                })
            "
            placeholder="{}"
            spellcheck="false"
            class="input code-input"
            :class="{ invalid: overrideInvalid }"
          ></textarea>
          <BaseCopyableCode
            v-if="newUses"
            :text="JSON.stringify(newUses, null, 2)"
          ></BaseCopyableCode>
        </div>
      </BaseDropDown>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import type { EditUsesState } from "@/utils/usesUtils";
import BaseDropDown from "../Base/BaseDropDown.vue";
import EditRollUse from "./EditRollUse.vue";
import EditHealUses from "./EditHealUses.vue";
import BaseCopyableCode from "../Base/BaseCopyableCode.vue";
import { computed } from "vue";
import type { UsesMap } from "vennt-library";
import EditAdjustUses from "./EditAdjustUses.vue";

const props = defineProps<{
  modelValue: EditUsesState;
  type: "ability" | "item";
  name: string;
  overrideInvalid: boolean;
  newUses: UsesMap | null;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", state: EditUsesState): void;
}>();

const displayEditType = computed(() =>
  props.type === "ability" ? "Ability" : "Item",
);
</script>

<style scoped>
.code-input {
  font-family: var(--code-font);
}
</style>
