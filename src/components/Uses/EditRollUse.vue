<template>
  <BaseDropDown title="Heal resources using dice roll">
    <div class="m-8">
      <slot name="desc"></slot>
      <div class="cols-2 center-items gap">
        <label for="edit-uses-dice-roll-main-attr" class="label-text"
          >Attribute:</label
        >
        <SelectHealAttributeInput
          :model-value="modelValue.attr"
          @update:model-value="
            (attr) => emit('update:modelValue', { ...modelValue, attr })
          "
          id="edit-uses-dice-roll-main-attr"
        >
        </SelectHealAttributeInput>
        <label for="edit-uses-dice-roll-main-dice" class="label-text"
          >Dice:</label
        >
        <input
          type="text"
          :value="modelValue.dice"
          @input="
            (e) =>
              emit(
                'update:modelValue',
                // @ts-expect-error ts doesn't like e.target.value
                { ...modelValue, dice: e.target.value },
              )
          "
          placeholder="2d6+spi"
          title="Dice roll formula. You can use attribute names in the formula."
          id="edit-uses-dice-roll-main-dice"
          class="input"
        />
      </div>
      <EditHealUses
        drop-down-title="Additional Adjustments on roll"
        :model-value="modelValue.adjusts"
        @update:model-value="
          (adjusts) => emit('update:modelValue', { ...modelValue, adjusts })
        "
        class="mt-8"
        ><template #desc
          ><p class="mt-0 mb-8">
            Use this sub-section to add additional non-dice based attribute
            heals / costs
          </p></template
        ></EditHealUses
      >
      <BaseDropDown v-if="modelValue.dice" title="Test dice formula">
        <ToggleableDiceSection v-if="dice" :dice="dice"></ToggleableDiceSection>
        <div v-else>Dice formula is not valid!</div>
      </BaseDropDown>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import type { EditRollUses } from "@/utils/usesUtils";
import BaseDropDown from "../Base/BaseDropDown.vue";
import EditHealUses from "./EditHealUses.vue";
import SelectHealAttributeInput from "./SelectHealAttributeInput.vue";
import ToggleableDiceSection from "../Dice/ToggleableDiceSection.vue";
import { computed } from "vue";
import { diceParseFromString } from "vennt-library";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ modelValue: EditRollUses; name?: string }>();
const emit = defineEmits<{
  (e: "update:modelValue", state: EditRollUses): void;
}>();
const entityStore = useEntityStore();

const dice = computed(() =>
  diceParseFromString(
    props.modelValue.dice,
    undefined,
    `Testing new dice for "${props.name}"`,
    undefined,
    entityStore.computedAttributes,
  ),
);
</script>
