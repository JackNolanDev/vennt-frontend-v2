<template>
  <div class="cols-2 mt-4">
    <label for="damage-calc-acc" class="nowrap label-text label-min">
      Accuracy:
    </label>
    <input
      type="number"
      inputmode="numeric"
      min="0"
      :value="modelValue.accuracy"
      @input="
        (e) =>
          emits('update:modelValue', {
            ...modelValue,
            // @ts-expect-error ts doesn't like e.target.value
            accuracy: Math.max(numberFieldVal(e.target.value), 0),
          })
      "
      placeholder="0"
      title="incoming attack accuracy"
      id="damage-calc-acc"
      class="input"
    />
  </div>
  <DamageCalculatorSingleInput
    v-if="modelValue.damages.length > 0"
    :model-value="modelValue.damages[0]"
    @update:model-value="(dmg) => updateDamage(dmg, 0)"
  ></DamageCalculatorSingleInput>
  <BaseDropDown title="Additional Options" class="mt-4">
    <div class="mt-4 mr-8 ml-8 mb-8">
      <div class="alignRow gap mt-4">
        <label for="damage-calc-num" class="nowrap label-text">
          Number of Attacks:
        </label>
        <input
          type="number"
          inputmode="numeric"
          min="1"
          :value="modelValue.numberOfAttacks"
          @input="
            (e) =>
              emits('update:modelValue', {
                ...modelValue,
                // @ts-expect-error ts doesn't like e.target.value
                numberOfAttacks: Math.max(numberFieldVal(e.target.value), 1),
              })
          "
          placeholder="1 (Optional)"
          title="number of incoming attacks"
          id="damage-calc-num"
          class="input"
        />
      </div>
      <div
        v-if="modelValue.damages.length > 1"
        class="separator mt-8 mb-8"
      ></div>
      <div
        v-for="(input, idx) in modelValue.damages.slice(1)"
        :key="`input-${input.type}-${idx}`"
      >
        <div class="alignRow split">
          <strong class="label-text mb-8">Damage type #{{ idx + 2 }}</strong>
          <BaseButton
            @click="removeDamageTpe(idx + 1)"
            icon="close"
            title="Remove this damage type from the incoming attack"
          ></BaseButton>
        </div>
        <DamageCalculatorSingleInput
          :model-value="input"
          @update:model-value="(dmg) => updateDamage(dmg, idx + 1)"
        ></DamageCalculatorSingleInput>
        <div class="separator mt-8 mb-8"></div>
      </div>
      <BaseButton
        @click="addDamageType"
        icon="add"
        class="secondary wide skinny mt-4"
        >Add Another Damage Type</BaseButton
      >
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import {
  DamageType,
  type AttackDamage,
  type AttackDetails,
} from "vennt-library";
import { numberFieldVal } from "@/utils/inputType";
import DamageCalculatorSingleInput from "./DamageCalculatorSingleInput.vue";
import BaseDropDown from "../../Base/BaseDropDown.vue";
import BaseButton from "../../Base/BaseButton.vue";

const props = defineProps<{ modelValue: AttackDetails }>();
const emits = defineEmits<{
  (e: "update:modelValue", state: AttackDetails): void;
}>();

const updateDamage = (damage: AttackDamage, idx: number) => {
  const newModel = props.modelValue;
  newModel.damages[idx] = damage;
  emits("update:modelValue", newModel);
};

const addDamageType = () => {
  const newModel = props.modelValue;
  newModel.damages.push({ damage: 0, type: DamageType.PHYSICAL });
  emits("update:modelValue", newModel);
};

const removeDamageTpe = (idx: number) => {
  const newModel = props.modelValue;
  newModel.damages.splice(idx, 1);
  emits("update:modelValue", newModel);
};
</script>
