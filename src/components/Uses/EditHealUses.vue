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
            <span v-if="forAdjustments">Adjust</span><span v-else>Heal</span>
            {{ attrShortName(val.attr) || idx + 1 }}
          </p>
          <BaseButton
            @click="emit('update:modelValue', modelValue.toSpliced(idx, 1))"
            icon="close"
            title="Remove this adjustment"
            class="small-icon"
          ></BaseButton>
        </div>
        <div class="cols-2 center-items gap">
          <label :for="`type-${idx}-${unique}`" class="label-text">Type:</label>
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
            :id="`type-${idx}-${unique}`"
            class="input"
          >
            <option value="number">Basic</option>
            <option value="equation">Equation</option>
          </select>
          <label :for="`attr-${idx}-${unique}`" class="label-text"
            >Attribute:</label
          >
          <SelectAdjustAttributeInput
            v-if="forAdjustments"
            :model-value="val.attr"
            @update:model-value="
              (attr) =>
                emit(
                  'update:modelValue',
                  modelValue.with(idx, { ...val, attr }),
                )
            "
            :id="`attr-${idx}-${unique}`"
          ></SelectAdjustAttributeInput>
          <SelectHealAttributeInput
            v-else
            :model-value="val.attr"
            @update:model-value="
              (attr) =>
                emit(
                  'update:modelValue',
                  modelValue.with(idx, { ...val, attr }),
                )
            "
            :id="`attr-${idx}-${unique}`"
          ></SelectHealAttributeInput>
          <label :for="`adjust-${idx}-${unique}`" class="label-text"
            ><span v-if="forAdjustments">Adjust</span
            ><span v-else>Heal</span>:</label
          >
          <input
            v-if="val.type === 'number'"
            type="number"
            :value="val.adjust"
            @input="(e) => healFieldTyping(e, idx, val)"
            placeholder="6"
            :title="adjustTitle"
            :id="`adjust-${idx}-${unique}`"
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
            :title="adjustTitle"
            :id="`adjust-${idx}-${unique}`"
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
            !forAdjustments &&
            val.type === 'number' &&
            val.attr &&
            numberFieldVal(val.adjust) < 0
          "
          class="small-text mt-8 mb-0"
        >
          Negative heal amounts are valid. This just means that
          {{ -numberFieldVal(val.adjust) }}
          {{ attrShortName(val.attr) }}
          will be taken as a cost to use this ability.
        </p>
        <div
          v-if="
            forAdjustments &&
            val.type === 'equation' &&
            typeof val.adjust === 'string' &&
            !val.adjust.toLowerCase().includes(val.attr)
          "
          class="mt-8 mb-0"
        >
          <p>
            WARNING: When using an equation for an adjustment, you generally
            want to include the attribute you are adjusting in the equation. For
            example:
          </p>
          <p>
            {{ attrShortName(val.attr) }} =
            <code>{{ val.attr }}+spi</code>
          </p>
          <p>or</p>
          <p>
            {{ attrShortName(val.attr) }} =
            <code>({{ val.attr }}*2)/3</code>
          </p>
        </div>
        <p
          v-if="
            val.type === 'equation' &&
            typeof val.adjust === 'string' &&
            val.adjust !== ''
          "
          class="mt-8 mb-0"
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
        ><span v-if="forAdjustments">Add adjustment</span
        ><span v-else>Add heal (or cost)</span></BaseButton
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
import SelectAdjustAttributeInput from "./SelectAdjustAttributeInput.vue";
import { computed } from "vue";

const unique = Math.random().toString().substring(2);

const props = defineProps<{
  modelValue: EditUsesAdjustment[];
  dropDownTitle: string;
  forAdjustments?: boolean;
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

const adjustTitle = computed(
  () => `Amount to ${props.forAdjustments ? "adjust" : "heal"} attribute`,
);
</script>
