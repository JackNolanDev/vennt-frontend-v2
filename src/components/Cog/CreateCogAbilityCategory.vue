<template>
  <h4 class="mt-0">{{ category.name }}</h4>
  <BaseRadioButtons
    :options="options"
    :selected="selected"
    :attrs="cogCreateStore.cogAttrs"
    :unselectable="true"
    :disabled-options="disabledOptions"
    @selected-updated="selectionUpdated"
  ></BaseRadioButtons>
  <div v-if="showVariableCostInput">
    <label :for="variableCostInputId" class="labelText"
      >{{ selected }} AP Cost</label
    >
    <input
      type="number"
      inputmode="numeric"
      v-model.number="cogCreateStore.options.variableAbilityCost[selected]"
      @blur="cogCreateStore.saveToLocalStorage()"
      min="0"
      :max="selectedMaxCost"
      :invalid="variableCostInputInvalid"
      :id="variableCostInputId"
      class="input"
    />
  </div>
</template>

<script setup lang="ts">
import { useCogCreateStore } from "@/stores/cogCreate";
import { solveEquation } from "@/utils/attributeUtils";
import type { HTMLString } from "@/utils/backendTypes";
import {
  cogAbilityMap,
  type CogAbilityCategory,
} from "@/utils/copy/createCogAbilityOptions";
import {
  cogAbilityCost,
  keysToCogAbilities,
} from "@/utils/copy/createCogLogic";
import { stringToLinkID } from "@/utils/textUtils";
import { computed } from "vue";
import BaseRadioButtons from "../Base/BaseRadioButtons.vue";

const props = defineProps<{ category: CogAbilityCategory }>();

const cogCreateStore = useCogCreateStore();

const options = computed(() => {
  return props.category.options.reduce<Record<string, HTMLString>>(
    (acc, ability) => {
      const markdown = `**${ability.name} [{{${ability.cost}}} AP]**:<br>${ability.effect}`;
      acc[ability.name] = markdown;
      return acc;
    },
    {}
  );
});

const selected = computed(
  () => cogCreateStore.options.abilitySelection[props.category.name] ?? ""
);
const selectedCogAbility = computed(() => {
  return cogAbilityMap[selected.value];
});
const showVariableCostInput = computed(() => {
  return selectedCogAbility.value?.cost?.toString().includes("X");
});
const variableCostInputId = computed(
  () => `${stringToLinkID(props.category.name)}-cost-input`
);
const selectedMaxCost = computed(() => {
  const maxCost = selectedCogAbility.value?.maxCost ?? 100;
  return typeof maxCost === "number"
    ? maxCost
    : solveEquation(maxCost, cogCreateStore.cogAttrs) ?? 0;
});
const variableCostInputInvalid = computed(() => {
  const value = cogCreateStore.options.variableAbilityCost[selected.value];
  if (!value || typeof value === "string") {
    return true;
  }
  return value < 0 || value > selectedMaxCost.value;
});
const disabledOptions = computed(() => {
  const selectedCost = selectedCogAbility.value
    ? cogAbilityCost(selectedCogAbility.value, cogCreateStore.options)
    : 0;
  const unselectedAP = selectedCost + cogCreateStore.remainingAP;
  const abilities = keysToCogAbilities(Object.keys(options.value));
  return abilities
    .filter(
      (ability) =>
        cogAbilityCost(ability, cogCreateStore.options) > unselectedAP
    )
    .map((ability) => ability.name);
});

const selectionUpdated = (option: string) => {
  cogCreateStore.options.abilitySelection[props.category.name] = option;
  cogCreateStore.saveToLocalStorage();
};
</script>
