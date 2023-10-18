<template>
  <h2>Damage Calculator</h2>
  <form>
    <DamageCalculatorInput v-model="state.attack"></DamageCalculatorInput>
    <div class="separator mt-8 mb-8"></div>
    <BaseCheckBox
      v-if="hasDodge"
      :checked="state.useDodge"
      :disabled="!canDodge"
      :useToggle="true"
      :highlight="true"
      @click="state.useDodge = !state.useDodge"
      class="wide"
      >Use Dodge</BaseCheckBox
    >
    <!-- TODO: This should only be visible if someone in the party has this ability -->
    <BaseCheckBox
      :checked="state.holyShield"
      :useToggle="true"
      :highlight="true"
      :disabled="!canUseAlerts"
      @click="state.holyShield = !state.holyShield"
      class="wide"
      >In range of Holy Shield</BaseCheckBox
    >
    <div v-if="alerts" class="alignRow mt-4">
      <label :for="Fields.ALERTS" class="nowrap label-text mr-16">
        Alerts to use:
      </label>
      <input
        type="number"
        inputmode="numeric"
        v-model.number="state.alerts"
        min="0"
        :max="alerts"
        :disabled="!canUseAlerts"
        placeholder="0"
        title="Number of alerts you want to use to reduce damage"
        :id="Fields.ALERTS"
        class="input"
      />
    </div>
    <BaseCheckBox
      v-if="hasBlock"
      :checked="state.useBlock"
      :disabled="!canBlock"
      :useToggle="true"
      :highlight="true"
      @click="state.useBlock = !state.useBlock"
      class="wide mt-4"
      >Use Block</BaseCheckBox
    >
    <div class="separator mt-8 mb-8"></div>
    <BaseButton @click="applyResult" class="primary wide"
      >Apply Result (total {{ hpDamage }} HP)</BaseButton
    >
    <table
      v-if="Object.keys(calculatorResult.adjustAttrs).length > 0"
      class="mt-16"
    >
      <tr>
        <th>Attribute</th>
        <th>Change</th>
      </tr>
      <tr v-for="(change, attr) in calculatorResult.adjustAttrs" :key="attr">
        <td>{{ attrShortName(attr) }}</td>
        <td>{{ change }}</td>
      </tr>
    </table>
    <p>Explanation:</p>
    <ol>
      <li v-for="reason in calculatorResult.reasons" :key="reason">
        {{ reason }}
      </li>
    </ol>
  </form>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { adjustAttrsAPI, attrShortName } from "@/utils/attributeUtils";
import {
  DamageType,
  NORMAL_DAMAGES,
  type AttackDetails,
  type AttackResponse,
} from "@/utils/backendTypes";
import { computed, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import BaseCheckBox from "../Base/BaseCheckBox.vue";
import { numberFieldVal } from "@/utils/inputType";
import DamageCalculatorInput from "./DamageCalculatorInput.vue";
import { handleDamageCalculator } from "@/utils/damageCalculator";

enum Fields {
  DAMAGE = "damage-calculator-damage",
  ACCURACY = "damage-calculator-accuracy",
  TYPE = "damage-calculator-type",
  ATTRIBUTE = "damage-calculator-attribute",
  NUMBER = "damage-calculator-number",
  ALERTS = "damage-calculator-alerts",
}

interface CalculatorState {
  attack: AttackDetails;
  alerts: string | number;
  useDodge: boolean;
  useBlock: boolean;
  holyShield: boolean;
}

const defaultState = (): CalculatorState => ({
  attack: { accuracy: 0, damages: [{ damage: 0, type: DamageType.PHYSICAL }] },
  alerts: "",
  useDodge: false,
  useBlock: false,
  holyShield: false,
});

const state = reactive<CalculatorState>(defaultState());
const entityStore = useEntityStore();

const alerts = computed(() => entityStore.entityAttributes.alerts?.val);
const hasDodge = computed(() => entityStore.abilityNames.includes("Dodge"));
const canDodge = computed(
  () =>
    entityStore.entityAttributes.vim &&
    entityStore.entityAttributes.vim.val * 10 >=
      (typeof state.attack.accuracy === "number"
        ? state.attack.accuracy
        : parseInt(state.attack.accuracy)) &&
    (!entityStore.inCombat ||
      (entityStore.entityAttributes.reactions?.val ?? 0) > 0)
);
const hasBlock = computed(() => entityStore.abilityNames.includes("Block"));
const canBlock = computed(
  () =>
    !(canDodge.value && state.useDodge) &&
    state.attack.damages.some((detail) =>
      NORMAL_DAMAGES.includes(detail.type)
    ) &&
    (!entityStore.inCombat ||
      (entityStore.entityAttributes.reactions?.val ?? 0) > 0)
);
const hasShieldBlock = computed(() =>
  entityStore.abilityNames.includes("Shield Block")
);
const hasImprovedShieldBlock = computed(() =>
  entityStore.abilityNames.includes("Improved Shield Block")
);
const hasEnhancedBlock = computed(() =>
  entityStore.abilityNames.includes("Enhanced Block")
);
const hasShieldMastery = computed(() =>
  entityStore.abilityNames.includes("Shield Mastery")
);
const hasDiamondBlock = computed(() =>
  entityStore.abilityNames.includes("Diamond Block")
);
const hasNotAScratch = computed(() =>
  entityStore.abilityNames.includes("Not A Scratch")
);
const canUseAlerts = computed(() =>
  state.attack.damages.some((detail) => NORMAL_DAMAGES.includes(detail.type))
);
const calculatorResult = computed(() => {
  const attackResponse: AttackResponse = {
    alerts: numberFieldVal(state.alerts),
    dodge: hasDodge.value && canDodge.value && state.useDodge,
    block: hasBlock.value && canBlock.value && state.useBlock,
    inHolyShield: state.holyShield,
    hasShieldBlock: hasShieldBlock.value,
    hasImprovedShieldBlock: hasImprovedShieldBlock.value,
    hasEnhancedBlock: hasEnhancedBlock.value,
    hasShieldMaster: hasShieldMastery.value,
    hasDiamondBlock: hasDiamondBlock.value,
    hasNotAScratch: hasNotAScratch.value,
  };

  return handleDamageCalculator(
    state.attack,
    attackResponse,
    entityStore.entityAttributes
  );
});
const hpDamage = computed(() =>
  calculatorResult.value.adjustAttrs.hp
    ? -calculatorResult.value.adjustAttrs.hp
    : 0
);

const applyResult = () => {
  if (!entityStore.entity) {
    return;
  }
  let mainAction = "Took";
  if (state.useDodge) {
    mainAction = "Dodged";
  } else if (state.useBlock) {
    mainAction = "Blocked";
  }
  adjustAttrsAPI(
    entityStore.entity,
    entityStore.entityAttributes,
    calculatorResult.value.adjustAttrs,
    {
      msg: `${mainAction} ${state.attack.damages[0].type} attack for ${state.attack.damages[0].damage} damage`,
    }
  );

  const attacksNumber = numberFieldVal(state.attack.numberOfAttacks ?? 0);
  if (attacksNumber > 1) {
    state.attack.numberOfAttacks = attacksNumber - 1;
  } else {
    const defState = defaultState();
    state.attack = defState.attack;
    state.alerts = defState.alerts;
    state.holyShield = defState.holyShield;
    state.useBlock = defState.useBlock;
    state.useDodge = defState.useDodge;
  }
};
</script>
