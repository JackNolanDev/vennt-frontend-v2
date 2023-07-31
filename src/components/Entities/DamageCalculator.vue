<template>
  <h2>Damage Calculator</h2>
  <form>
    <div class="alignRow mt-4">
      <label :for="Fields.DAMAGE" class="nowrap label-text label-min">
        Damage:
      </label>
      <input
        type="number"
        inputmode="numeric"
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
        inputmode="numeric"
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
    <div class="alignRow mt-4">
      <label :for="Fields.NUMBER" class="nowrap label-text label-min">
        Number:
      </label>
      <input
        type="number"
        inputmode="numeric"
        @keyup.enter="jumpToNextField(Fields.NUMBER)"
        min="0"
        v-model.number="state.number"
        placeholder="1 (Optional)"
        title="number of incoming attacks"
        :id="Fields.NUMBER"
        class="input"
      />
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
        inputmode="numeric"
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
      :disabled="!canBlock"
      :useToggle="true"
      :highlight="true"
      @click="state.useBlock = !state.useBlock"
      class="wide mt-4"
      >Use Block</BaseCheckBox
    >
    <div class="separator mt-8 mb-8"></div>
    <BaseButton
      :disabled="state.damage === ''"
      @click="applyResult"
      class="primary wide"
      >Apply Result (total {{ calculatorResult.hpDamage }} HP)</BaseButton
    >
    <table
      v-if="Object.keys(calculatorResult.adjustAttrs).length > 0"
      class="mt-8"
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
import {
  adjustAttrsAPI,
  attrFullName,
  attrShortName,
} from "@/utils/attributeUtils";
import { ATTRIBUTES, type EntityAttribute } from "@/utils/backendTypes";
import { computed, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import BaseCheckBox from "../Base/BaseCheckBox.vue";

enum Fields {
  DAMAGE = "damage-calculator-damage",
  ACCURACY = "damage-calculator-accuracy",
  TYPE = "damage-calculator-type",
  ATTRIBUTE = "damage-calculator-attribute",
  NUMBER = "damage-calculator-number",
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

interface CalculatorState {
  damage: string | number;
  accuracy: string | number;
  type: DamageType;
  attribute: EntityAttribute;
  number: string | number;
  alerts: string | number;
  useDodge: boolean;
  useBlock: boolean;
  holyShield: boolean;
}

const defaultState = (): CalculatorState => ({
  damage: "",
  accuracy: "",
  type: DamageType.PHYSICAL,
  number: "",
  attribute: "per",
  alerts: "",
  useDodge: false,
  useBlock: false,
  holyShield: false,
});

const state = reactive<CalculatorState>(defaultState());
const entityStore = useEntityStore();

const normalDamage = [
  DamageType.BLUDGEONING,
  DamageType.GALVANIC,
  DamageType.MAGICAL,
  DamageType.PHYSICAL,
  DamageType.PIERCING,
  DamageType.SLASHING,
];
const physicalSubDamages = [
  DamageType.BLUDGEONING,
  DamageType.PIERCING,
  DamageType.SLASHING,
];

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
const canBlock = computed(
  () => !(canDodge.value && state.useDodge) && normalDamage.includes(state.type)
);
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
  const resistanceAttr = `${state.type}_damage_resistance`;
  let resistanceVal = entityStore.entityAttributes[resistanceAttr]?.val;
  if (!resistanceVal && physicalSubDamages.includes(state.type)) {
    // Look for default physical damage resistance
    resistanceVal =
      entityStore.entityAttributes.physical_damage_resistance?.val;
  }
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
      hpDamage: 0,
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

  if (isGlancingBlow && [DamageType.ATTRIBUTE].includes(state.type)) {
    damage = 0;
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
  let hpDamage = damage;
  let bleeding = 0;
  let burning = 0;
  let paralysis = 0;
  let stun = 0;

  if (!normalDamage.includes(state.type)) {
    hpDamage = 0;

    switch (state.type) {
      case DamageType.VIM: {
        vimCost += damage;
        break;
      }
      case DamageType.BLEED: {
        bleeding = -damage;
        break;
      }
      case DamageType.BURN: {
        burning = -damage;
        break;
      }
      case DamageType.PARALYSIS: {
        paralysis = -damage;
        break;
      }
      case DamageType.STUN: {
        stun = -damage;
        break;
      }
    }
  }

  const adjustAttrs: Record<EntityAttribute, number> = {
    ...(hpDamage > 0 && { hp: -hpDamage }),
    ...(vimCost > 0 && { vim: -vimCost }),
    ...(manualAlerts > 0 && { alerts: -manualAlerts }),
    ...(bleeding !== 0 && { bleeding }),
    ...(burning !== 0 && { burning }),
    ...(paralysis !== 0 && { paralysis }),
    ...(stun !== 0 && { stun }),
  };

  if (state.type === DamageType.ATTRIBUTE && damage > 0) {
    adjustAttrs[`${state.attribute}_dmg`] = damage;
  }

  const resultMessage = `result: ${state.type} attack for ${damage} damage`;
  reasons.push(resultMessage);

  return { adjustAttrs, hpDamage, resultMessage, reasons };
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
      if (showDamageAttribute.value) {
        return Fields.ATTRIBUTE;
      }
      return Fields.NUMBER;
    }
    case Fields.ATTRIBUTE:
      return Fields.NUMBER;
    case Fields.NUMBER: {
      if (alerts.value) {
        return Fields.ALERTS;
      }
      return false;
    }
    default:
      return false;
  }
};

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
    `${mainAction} ${state.type} attack for ${state.damage} damage`
  );

  const attacksNumber = numberFieldVal(state.number);
  if (attacksNumber > 1) {
    state.number = attacksNumber - 1;
  } else {
    const defState = defaultState();
    state.accuracy = defState.accuracy;
    state.alerts = defState.alerts;
    state.attribute = defState.attribute;
    state.damage = defState.damage;
    state.holyShield = defState.holyShield;
    state.number = defState.number;
    state.type = defState.type;
    state.useBlock = defState.useBlock;
    state.useDodge = defState.useDodge;
  }
};
</script>

<style scoped>
.label-min {
  min-width: 120px;
}
</style>
