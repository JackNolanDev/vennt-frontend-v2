<template>
  <div class="cols-2 mt-4">
    <label :for="damageId" class="nowrap label-text label-min">Damage:</label>
    <input
      type="number"
      inputmode="numeric"
      min="0"
      :value="modelValue.damage"
      @input="
        (e) =>
          emits('update:modelValue', {
            ...modelValue,
            // @ts-expect-error ts doesn't like e.target.value
            damage: Math.max(numberFieldVal(e.target.value), 0),
          })
      "
      placeholder="0"
      title="Full incoming attack damage"
      :id="damageId"
      class="input"
    />
  </div>
  <div class="cols-2 mt-4">
    <label :for="typeId" class="nowrap label-text label-min">Type:</label>
    <select
      :value="modelValue.type"
      @input="
        (e) =>
          emits('update:modelValue', {
            ...modelValue,
            // @ts-expect-error ts doesn't like e.target.value
            type: e.target.value ?? DamageType.PHYSICAL,
          })
      "
      :id="typeId"
      class="input"
    >
      <option
        v-for="choice in Object.values(DamageType)"
        :key="choice"
        :value="choice"
      >
        {{ choice.substring(0, 1).toUpperCase() }}{{ choice.substring(1) }}
      </option>
    </select>
  </div>
  <div v-if="showDamageAttribute" class="cols-2 mt-4">
    <label :for="attrId" class="nowrap label-text label-min">
      Attribute:
    </label>
    <select
      :value="modelValue.attribute"
      @input="
        (e) =>
          emits('update:modelValue', {
            ...modelValue,
            // @ts-expect-error ts doesn't like e.target.value
            attribute: e.target.value ?? 'per',
          })
      "
      :id="attrId"
      class="input"
    >
      <option v-for="attr in ATTRIBUTES" :key="attr" :value="attr">
        {{ attrFullName(attr) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { attrFullName } from "@/utils/attributeUtils";
import { ATTRIBUTES, type AttackDamage, DamageType } from "vennt-library";
import { numberFieldVal } from "@/utils/inputType";
import { computed } from "vue";

const props = defineProps<{ modelValue: AttackDamage }>();
const emits = defineEmits<{
  (e: "update:modelValue", state: AttackDamage): void;
}>();

// Use this to ensure ids are always unique
const unique = Math.random().toString().substring(2);

const damageId = `damage-calc-damage-${unique}`;
const typeId = `damage-calc-type-${unique}`;
const attrId = `damage-calc-attr-${unique}`;

const showDamageAttribute = computed(
  () => props.modelValue.type === DamageType.ATTRIBUTE
);
</script>
