<template>
  <ConfirmationModal
    id="entity-rest-modal"
    trigger-icon="bed"
    trigger-class="wide"
    :is-large="true"
    @main-button="restButton"
  >
    <template #triggerButton>Rest</template>
    <template #title
      >{{ state.isRecoveryRest ? "Recovery" : "" }} Resting</template
    >
    <template #mainButton>Rest</template>
    <div class="alignRow">
      <BaseCheckBox
        :checked="state.isRecoveryRest"
        @click="() => (state.isRecoveryRest = !state.isRecoveryRest)"
        :highlight="true"
        :use-toggle="true"
        class="wide"
        ><span v-if="state.isRecoveryRest">Take a Basic Rest</span
        ><span v-else>Take a Recovery Rest</span></BaseCheckBox
      >
      <BaseCheckBox
        v-if="showPayUsingHeroPointToggle"
        :checked="state.useHeroPoint"
        :highlight="true"
        @click="() => (state.useHeroPoint = !state.useHeroPoint)"
        >Pay Using Hero Point</BaseCheckBox
      >
    </div>
    <div class="cols-2 gap mt-8">
      <RollDiceInput
        v-if="showRecoveryShockDiceSection"
        :dice="recoveryShockDice"
        v-model="state.recoveryShockRoll"
        input-placeholder="Recovery Shock roll result"
        class="border"
        ><template #title
          ><p class="m-8">
            <strong>Roll to decrease Recovery Shock</strong><br />(Current
            value: {{ entityStore.computedAttributes.recovery_shock?.val }})
          </p></template
        ></RollDiceInput
      >
      <RollDiceInput
        v-if="showRecoveryDiceSection"
        :dice="recoveryDice"
        v-model="state.recoveryRoll"
        input-placeholder="Recovery Rest roll result"
        class="border"
        ><template #title
          ><p class="m-8">
            <strong>Roll for Recovery Rest</strong>
          </p></template
        ></RollDiceInput
      >
      <div
        v-if="Object.keys(adjustAttrs).length > 0"
        class="card column border"
      >
        <p class="m-8">
          <strong>Resting Results</strong>
        </p>
        <table class="no-border">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(change, attr) in adjustAttrs" :key="attr">
              <td>{{ attrShortName(attr as EntityAttribute) }}</td>
              <td>{{ change }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="showPayUsingHeroPointToggle && state.useHeroPoint"
        class="card column border"
      >
        <p class="m-8">
          <strong>Paying with a Hero Point</strong>
        </p>
        <p class="mt-0 mb-0 ml-8 mr-8 text-block">
          For 1 Hero Point, you may trigger the effect of Resting Recovery
          during any Rest when you normally would not recover; or gain half the
          effects of a Resting Recovery during any Respite (using the entire
          Respite). You may use Hero Points in this way once per Rest.
        </p>
        <BaseCheckBox
          :checked="state.restingDuringRespite"
          :highlight="true"
          @click="
            () => (state.restingDuringRespite = !state.restingDuringRespite)
          "
          class="wide"
          >This Rest is actually during a Respite</BaseCheckBox
        >
      </div>
    </div>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import ConfirmationModal from "../Base/ConfirmationModal.vue";
import { handleEndTimePeriod } from "@/utils/combatUtils";
import BaseCheckBox from "../Base/BaseCheckBox.vue";
import {
  ATTRIBUTE_DAMAGES,
  attrShortName,
  buildDice,
  getMaxAttr,
} from "vennt-library";
import { useDiceStore } from "@/stores/dice";
import { useEntityStore } from "@/stores/entity";
import RollDiceInput from "../Dice/RollDiceInput.vue";
import type { EntityAttribute, PartialEntityAttributes } from "vennt-library";
import { numberFieldVal } from "@/utils/inputType";
import { adjustAttrsAPI } from "@/utils/attributeUtils";

const entityStore = useEntityStore();
const diceStore = useDiceStore();
const defaultState = () => ({
  isRecoveryRest: false,
  useHeroPoint: false,
  restingDuringRespite: false,
  recoveryShockRoll: "",
  recoveryRoll: "",
});
const state = reactive(defaultState());

const showPayUsingHeroPointToggle = computed(
  () =>
    state.isRecoveryRest && (entityStore.computedAttributes.hero?.val ?? 0) > 0,
);
const showRecoveryShockDiceSection = computed(
  () => (entityStore.computedAttributes.recovery_shock?.val ?? 0) > 0,
);
const showRecoveryDiceSection = computed(() => state.isRecoveryRest);
const recoveryShockDice = computed(() =>
  buildDice(
    1,
    6,
    0,
    diceStore.defaultDiceSettings,
    "Resting Recovery Shock reduction dice check",
  ),
);
const recoveryDice = computed(() => {
  const num = Math.max(entityStore.computedAttributes.str?.val ?? 1, 1);
  return buildDice(
    num,
    6,
    0,
    diceStore.defaultDiceSettings,
    "Resting recovery dice check",
  );
});
const adjustAttrs = computed(() => {
  const attrs: PartialEntityAttributes = {};

  // 1. Recovery Shock
  if (showRecoveryShockDiceSection.value) {
    const recoveryShockResult = Math.min(
      numberFieldVal(state.recoveryShockRoll),
      entityStore.computedAttributes.recovery_shock?.val ?? 0,
    );
    if (recoveryShockResult > 0) {
      attrs.recovery_shock = -recoveryShockResult;
    }
  }

  // 2. Recovery Rest Logic
  if (state.isRecoveryRest) {
    const recoveryResult = numberFieldVal(state.recoveryRoll);
    let vimHeal = Math.max(recoveryResult, 1);
    let mpHeal = Math.max(Math.ceil(recoveryResult / 2), 1);
    let hpHeal = Math.max(Math.ceil(recoveryResult / 4), 1);

    if (
      showPayUsingHeroPointToggle.value &&
      state.useHeroPoint &&
      state.restingDuringRespite
    ) {
      vimHeal = Math.floor(vimHeal / 2);
      mpHeal = Math.floor(mpHeal / 2);
      hpHeal = Math.floor(hpHeal / 2);
    }

    const applyToAttrs = (attr: "vim" | "mp" | "hp", val: number) => {
      const heal = Math.min(
        val,
        (entityStore.computedAttributes[getMaxAttr(attr)!]?.val ?? 0) -
          (entityStore.computedAttributes[attr]?.val ?? 0),
      );
      if (heal > 0) {
        attrs[attr] = heal;
      }
    };

    applyToAttrs("vim", vimHeal);
    applyToAttrs("mp", mpHeal);
    applyToAttrs("hp", hpHeal);
  }

  // 3. Attribute Damage
  ATTRIBUTE_DAMAGES.forEach((attr) => {
    const damageVal = entityStore.computedAttributes[attr]?.val;
    if (damageVal && damageVal > 0) {
      attrs[attr] = -1;
    }
  });

  // 4. Hero Point Cost
  if (showPayUsingHeroPointToggle.value && state.useHeroPoint) {
    attrs.hero = -1;
  }
  return attrs;
});

const restButton = () => {
  if (!entityStore.entity) {
    return;
  }
  const restingDuringRespite =
    state.isRecoveryRest && state.useHeroPoint && state.restingDuringRespite;
  adjustAttrsAPI(
    entityStore.entity,
    entityStore.computedAttributes,
    adjustAttrs.value,
    {
      msg: `${state.isRecoveryRest ? "Recovery " : ""}Rest${
        restingDuringRespite ? " (during Respite)" : ""
      }`,
      enforceMaximums: true,
    },
  );
  let period: "rest" | "encounter" = "rest";
  if (restingDuringRespite) {
    period = "encounter";
  }
  handleEndTimePeriod(period);
  state.isRecoveryRest = false;
  state.useHeroPoint = false;
  state.restingDuringRespite = false;
  state.recoveryShockRoll = "";
  state.recoveryRoll = "";
};
</script>
