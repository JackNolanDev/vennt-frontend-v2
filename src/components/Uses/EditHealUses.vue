<template>
  <BaseDropDown :title="dropDownTitle">
    <div class="m-8">
      <slot name="desc"></slot>
      <div
        v-for="(val, idx) in modelValue"
        :key="idx"
        class="card column padded thin mb-8"
      >
        <div class="alignRow split mb-8">
          <p class="mt-0 mb-0 label-text">
            Heal {{ attrShortName(val.attr) || idx + 1 }}
          </p>
          <BaseButton
            @click="emit('update:modelValue', modelValue.toSpliced(idx, 1))"
            icon="close"
            title="Remove this adjustment"
            class="small-icon"
          ></BaseButton>
        </div>
        <div class="cols-2 center-items gap">
          <label :for="`edit-ability-dice-roll-type-${idx}`" class="label-text"
            >Type:</label
          >
          <select
            :value="val.type"
            @input="
              (e) =>
                emit(
                  'update:modelValue',
                  // @ts-expect-error ts doesn't like e.target.value
                  modelValue.with(idx, { ...val, type: e.target.value }),
                )
            "
            title="Type of adjustment. Basic adjustments only allow for simple numbers. Equation type adjustments allow you to use attributes and math."
            :id="`edit-ability-dice-roll-type-${idx}`"
            class="input"
          >
            <option value="number">Basic</option>
            <option value="equation">Equation</option>
          </select>
          <label :for="`edit-ability-dice-roll-attr-${idx}`" class="label-text"
            >Attribute:</label
          >
          <SelectHealAttributeInput
            :model-value="val.attr"
            @update:model-value="
              (attr) =>
                emit(
                  'update:modelValue',
                  modelValue.with(idx, { ...val, attr }),
                )
            "
            :id="`edit-ability-dice-roll-attr-${idx}`"
          ></SelectHealAttributeInput>
          <label :for="`edit-ability-dice-roll-heal-${idx}`" class="label-text"
            >Heal:</label
          >
          <input
            v-if="val.type === 'number'"
            type="number"
            :value="val.adjust"
            @input="(e) => healFieldTyping(e, idx, val)"
            placeholder="6"
            title="Amount to heal"
            :id="`edit-ability-dice-roll-heal-${idx}`"
            class="input"
            :class="{ invalid: val.adjust === 0 }"
          />
          <input
            v-else
            type="text"
            :value="val.adjust"
            @input="
              (e) =>
                emit(
                  'update:modelValue',
                  modelValue.with(idx, {
                    ...val,
                    // @ts-expect-error ts doesn't like e.target.value
                    adjust: e.target.value,
                  }),
                )
            "
            placeholder="str+2"
            title="Amount to heal"
            :id="`edit-ability-dice-roll-heal-${idx}`"
            class="input"
            :class="{
              invalid:
                typeof val.adjust === 'string' &&
                (val.adjust === '' ||
                  solveEquation(val.adjust, entityStore.computedAttributes) ===
                    undefined),
            }"
          />
        </div>
        <p
          v-if="
            val.type === 'number' && val.attr && numberFieldVal(val.adjust) < 0
          "
          class="small-text mt-8 mb-0"
        >
          Negative heal amounts are valid. This just means that
          {{ -numberFieldVal(val.adjust) }}
          {{ attrShortName(val.attr) }}
          will be taken as a cost to use this ability.
        </p>
        <p
          v-if="
            val.type === 'equation' &&
            typeof val.adjust === 'string' &&
            val.adjust !== ''
          "
        >
          Equation Result:
          {{
            solveEquation(val.adjust, entityStore.computedAttributes) ??
            "Invalid Equation!"
          }}
        </p>
      </div>
      <BaseButton
        @click="
          emit(
            'update:modelValue',
            modelValue.toSpliced(modelValue.length, 0, {
              attr: '',
              type: 'number',
              adjust: '',
            }),
          )
        "
        icon="add"
        class="primary wide"
        >Add heal (or cost)</BaseButton
      >
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import { attrShortName, solveEquation } from "vennt-library";
import type { EditUsesAdjustment } from "@/utils/usesUtils";
import { useEntityStore } from "@/stores/entity";
import { numberFieldVal } from "@/utils/inputType";
import BaseDropDown from "../Base/BaseDropDown.vue";
import BaseButton from "../Base/BaseButton.vue";
import SelectHealAttributeInput from "./SelectHealAttributeInput.vue";

const props = defineProps<{
  modelValue: EditUsesAdjustment[];
  dropDownTitle: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", state: EditUsesAdjustment[]): void;
}>();
const entityStore = useEntityStore();

const healFieldTyping = (e: Event, idx: number, val: EditUsesAdjustment) => {
  // @ts-expect-error ts doesn't like e.target.value
  const adjustStr: string = e.target?.value ?? "";
  const adjustNum = numberFieldVal(adjustStr, true);
  const adjust = isNaN(adjustNum) ? adjustStr : adjustNum;
  emit("update:modelValue", props.modelValue.with(idx, { ...val, adjust }));
};
</script>
