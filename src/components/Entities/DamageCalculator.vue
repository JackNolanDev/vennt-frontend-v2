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
    <div v-if="showDamageAttribute" class="alignRow mt-4">
      <label :for="Fields.ATTRIBUTE" class="nowrap label-text label-min">
        Attribute:
      </label>
      <select v-model="state.attribute" :id="Fields.ATTRIBUTE" class="input">
        <option v-for="attr in ATTRIBUTES" :key="attr" :value="attr">
          {{ attrFullName(attr) }}
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
import { attrFullName } from "@/utils/attributeUtils";
import { ATTRIBUTES, type EntityAttribute } from "@/utils/backendTypes";
import { computed, reactive } from "vue";
import BaseCheckBox from "../Base/BaseCheckBox.vue";

enum Fields {
  DAMAGE = "damage-calculator-damage",
  ACCURACY = "damage-calculator-accuracy",
  TYPE = "damage-calculator-type",
  ATTRIBUTE = "damage-calculator-attribute",
  ALERTS = "damage-calculator-alerts",
}

enum DamageType {
  PHYSICAL = "physical",
  MAGICAL = "magical",
  GALVANIC = "galvanic",
  PIERCING = "piercing",
  SLASHING = "slashing",
  BLUDGEONING = "bludgeoning",
  VIM = "vim",
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
  attribute: EntityAttribute;
  alerts: string | number;
  useDodge: boolean;
  useBlock: boolean;
  holyShield: boolean;
}>({
  damage: "",
  accuracy: "",
  type: DamageType.PHYSICAL,
  attribute: "per",
  alerts: "",
  useDodge: false,
  useBlock: false,
  holyShield: false,
});
const entityStore = useEntityStore();

const showDamageAttribute = computed(() => state.type === DamageType.ATTRIBUTE);
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

const numberFieldVal = (val: number | string, allowNaN?: boolean): number => {
  const parsedVal = typeof val === "number" ? val : parseInt(val);
  if (isNaN(parsedVal) && !allowNaN) {
    return 0;
  }
  return parsedVal;
};

const calculatorResult = computed(() => {
  let damage = numberFieldVal(state.damage);
  let vimCost = 0;
  const reasons: string[] = [];
  const acc = numberFieldVal(state.accuracy, true);
  const manualAlerts = numberFieldVal(state.alerts);
  let alerts = isNaN(manualAlerts) ? 0 : manualAlerts;

  const vim = entityStore.entityAttributes.vim?.val ?? 0;

  // 0. Handle damage resistance
  const resistance_attr = `${state.type}_damage_resistance`;
  const resistanceVal = entityStore.entityAttributes[resistance_attr]?.val;
  if (resistanceVal) {
    if (resistanceVal <= -2) {
      reasons.push(`Damage doubled due to damage type`);
      damage = damage * 2;
    } else if (resistanceVal <= -1) {
      reasons.push(
        `Damage increased by ${damage / 2} due to ${state.type} vulnerability`
      );
      damage = damage + damage / 2;
    } else if (resistanceVal <= 1) {
      reasons.push(
        `Damage decreased by ${damage / 2} due to ${state.type} resistance`
      );
      damage = damage / 2;
    } else {
      reasons.push(`Damage negated due to ${state.type} invulnerability`);
      damage = 0;
    }
  }

  // 0.5 exit early if evading attack
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

  if (alerts > 0 && damage > 0) {
    damage = damage >> alerts;
    reasons.push(`used ${alerts} alerts`);
  }

  // 3. Armor
  if (
    entityStore.entityAttributes.armor &&
    entityStore.entityAttributes.armor.val > 0 &&
    damage > 0 &&
    ![
      DamageType.ATTRIBUTE,
      DamageType.BLEED,
      DamageType.BURN,
      DamageType.FALL,
      DamageType.PARALYSIS,
      DamageType.STUN,
    ].includes(state.type)
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

    armor = Math.min(armor, damage);
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

  // Organize damage
  damage = Math.max(Math.floor(damage), 0);

  switch (state.type) {
    case DamageType.VIM: {
      vimCost += damage;
      damage = 0;
    }
  }

  let adjustAttrs: Record<EntityAttribute, number> = {
    ...(damage > 0 && { hp: -damage }),
    ...(vimCost > 0 && { vim: -vimCost }),
    ...(manualAlerts > 0 && { alerts: -manualAlerts }),
  };
  return { adjustAttrs, hpDamage: damage, reasons };
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
    case Fields.ACCURACY:
      return Fields.TYPE;
    case Fields.TYPE: {
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
