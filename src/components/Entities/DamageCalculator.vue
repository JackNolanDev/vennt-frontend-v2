<template>
  <h2>Damage Calculator</h2>
  <form>
    <div class="alignRow mt-4">
      <label :for="Fields.DAMAGE" class="nowrap label-text label-min">
        Damage:
      </label>
      <input
        type="number"
        @keyup.enter="jumpToNextField(Fields.DAMAGE)"
        min="0"
        v-model.number="state.damage"
        placeholder="0"
        title="Full incoming attack damage"
        :id="Fields.DAMAGE"
        class="input"
      />
    </div>
    <div class="alignRow mt-4">
      <label :for="Fields.ACCURACY" class="nowrap label-text label-min">
        Accuracy:
      </label>
      <input
        type="number"
        @keyup.enter="jumpToNextField(Fields.ACCURACY)"
        min="0"
        v-model.number="state.accuracy"
        placeholder="0"
        title="incoming attack accuracy"
        :id="Fields.ACCURACY"
        class="input"
      />
    </div>
    <div class="alignRow mt-4">
      <label :for="Fields.TYPE" class="nowrap label-text label-min">
        Type:
      </label>
      <select v-model="state.type" :id="Fields.TYPE" class="input">
        <option
          v-for="choice in Object.values(DamageType)"
          :key="choice"
          :value="choice"
        >
          {{ choice.substring(0, 1).toUpperCase() }}{{ choice.substring(1) }}
        </option>
      </select>
    </div>
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
        @keyup.enter="jumpToNextField(Fields.ALERTS)"
        v-model.number="state.alerts"
        min="0"
        :max="alerts"
        placeholder="0"
        title="Number of alerts you want to use to reduce damage"
        :id="Fields.ALERTS"
        class="input"
      />
    </div>
    <BaseCheckBox
      v-if="hasBlock"
      :checked="state.useBlock"
      :disabled="state.useDodge && canDodge"
      :useToggle="true"
      :highlight="true"
      @click="state.useBlock = !state.useBlock"
      class="wide mt-4"
      >Use Block</BaseCheckBox
    >
    <div class="mt-16">{{ calculatorResult }}</div>
  </form>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { computed, reactive } from "vue";
import BaseCheckBox from "../Base/BaseCheckBox.vue";

enum Fields {
  DAMAGE = "damage-calculator-damage",
  ACCURACY = "damage-calculator-accuracy",
  TYPE = "damage-calculator-type",
  ALERTS = "damage-calculator-alerts",
}

enum DamageType {
  PHYSICAL = "physical",
  PIERCING = "piercing",
  SLASHING = "slashing",
  BLUDGEONING = "bludgeoning",
  BURN = "burn",
  BLEED = "bleed",
  STUN = "stun",
  PARALYSIS = "paralysis",
  ATTRIBUTE = "attribute",
  FALL = "fall",
}

const state = reactive<{
  damage: string | number;
  accuracy: string | number;
  type: DamageType;
  alerts: string | number;
  useDodge: boolean;
  useBlock: boolean;
  holyShield: boolean;
}>({
  damage: "",
  accuracy: "",
  type: DamageType.PHYSICAL,
  alerts: "",
  useDodge: false,
  useBlock: false,
  holyShield: false,
});
const entityStore = useEntityStore();

const alerts = computed(() => entityStore.entityAttributes.alerts?.val);
const hasDodge = computed(() => entityStore.abilityNames.includes("Dodge"));
const canDodge = computed(
  () =>
    entityStore.entityAttributes.vim &&
    entityStore.entityAttributes.vim.val * 10 >=
      (typeof state.accuracy === "number"
        ? state.accuracy
        : parseInt(state.accuracy))
);
const hasBlock = computed(() => entityStore.abilityNames.includes("Block"));
const hasShieldBlock = computed(() =>
  entityStore.abilityNames.includes("Shield Block")
);
const hasImprovedShieldBlock = computed(() =>
  entityStore.abilityNames.includes("Improved Shield Block")
);

const calculatorResult = computed(() => {
  let damage =
    typeof state.damage === "number" ? state.damage : parseInt(state.damage);
  let vimCost = 0;
  const reasons: string[] = [];
  const acc =
    typeof state.accuracy === "number"
      ? state.accuracy
      : parseInt(state.accuracy);
  const manualAlerts =
    typeof state.alerts === "number" ? state.alerts : parseInt(state.alerts);
  let alerts = isNaN(manualAlerts) ? 0 : manualAlerts;

  const vim = entityStore.entityAttributes.vim?.val ?? 0;

  // 0. exit early if evading attack
  if (hasDodge.value && canDodge.value && state.useDodge) {
    reasons.push("evaded attack using Dodge");
    return {
      adjustAttrs: { vim: -Math.floor(acc / 10) },
      finalDamage: 0,
      reasons,
    };
  }

  let isGlancingBlow = false;

  // 1. glancing blow
  if (vim >= acc) {
    damage /= 2;
    isGlancingBlow = true;
    reasons.push("glancing blow");
  }

  // 2. Modifiers that apply to "incoming damage"

  if (state.holyShield) {
    alerts += 1;
    reasons.push(`gained 1 alert from Holy Shield`);
  }

  if (alerts > 0) {
    damage = damage >> alerts;
    reasons.push(`used ${alerts} alerts`);
  }

  // 3. Armor
  if (
    entityStore.entityAttributes.armor &&
    entityStore.entityAttributes.armor.val > 0
  ) {
    let armor = entityStore.entityAttributes.armor.val;
    let additionalReason = "";

    // Support for Shields
    if (
      state.useBlock &&
      isGlancingBlow &&
      hasShieldBlock.value &&
      entityStore.entityAttributes.shield &&
      entityStore.entityAttributes.shield.val > 0
    ) {
      armor += entityStore.entityAttributes.shield.val;
      additionalReason += ` including ${entityStore.entityAttributes.shield.val} from Shield Blocking`;

      if (hasImprovedShieldBlock.value && entityStore.entityAttributes.str) {
        armor += entityStore.entityAttributes.str.val;
        additionalReason += ` and ${entityStore.entityAttributes.str.val} from Improved Shield Blocking`;
      }
    }

    damage -= armor;
    reasons.push(`armor reduced damage by ${armor}${additionalReason}`);
  }

  // 4. Modifiers that apply to "incoming damage after Armor reduction"

  if (
    hasBlock.value &&
    state.useBlock &&
    entityStore.abilityNames.includes("Enhanced Block") &&
    damage > 0
  ) {
    damage /= 2;
    reasons.push("Enhanced Block - halves incoming damage");
  }

  // 5. Block
  if (state.useBlock && damage > 0) {
    const fullBlockVimCost = Math.floor(damage / 2);
    if (fullBlockVimCost > vim) {
      // partial block
      damage -= vim * 2;
      vimCost = vim;
      reasons.push(`Block - partial damage blocked`);
    } else {
      damage = 0;
      vimCost += fullBlockVimCost;
      reasons.push(`Block - full damage blocked`);
    }
  }

  const finalDamage = isNaN(damage) ? 0 : Math.max(Math.floor(damage), 0);
  const adjustAttrs = {
    ...(finalDamage > 0 && { hp: -finalDamage }),
    ...(vimCost > 0 && { vim: -vimCost }),
    ...(manualAlerts > 0 && { alerts: -manualAlerts }),
  };
  return { adjustAttrs, finalDamage, reasons };
});

const jumpToNextField = (current: Fields) => {
  const next = getNextField(current);
  if (next) {
    document.getElementById(next)?.focus();
  }
};

const getNextField = (current: Fields): string | false => {
  switch (current) {
    case Fields.DAMAGE:
      return Fields.ACCURACY;
    case Fields.ACCURACY: {
      if (alerts.value) {
        return Fields.ALERTS;
      }
      return false;
    }
    default:
      return false;
  }
};
</script>

<style scoped>
.label-min {
  min-width: 120px;
}
</style>
