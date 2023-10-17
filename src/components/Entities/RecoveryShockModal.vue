<template>
  <BaseModal
    v-if="
      entityStore.entity &&
      entityStore.recoveryShockSrc &&
      entityStore.recoveryShockSrc.length > 0
    "
    :hideButtons="true"
    @closeModal="closeModal"
  >
    <template #title
      >Recovery Shock from {{ entityStore.recoveryShockSrc[0] }}</template
    >
    <div class="card column padded thin">
      <p class="mt-0 mb-8">
        Roll a Strength check! If the result is less than your Recovery Shock
        ({{ entityStore.entityAttributes.recovery_shock?.val ?? 0 }}), you
        become permanently immune to the benefits of the spell or potion which
        just affected you!
      </p>
      <ToggleableDiceSection
        :dice="dice"
        :comment="diceComment"
        @roll-value="rollValue"
      ></ToggleableDiceSection>
      <div class="separator thin mt-8"></div>
      <div class="mt-8 mb-8 ml-8 mr-8">
        <div class="alignRow gap">
          <label for="item-roll-value" class="labelText nowrap">
            Roll value:
          </label>
          <input
            type="number"
            placeholder="Roll Result"
            v-model="state.rollValue"
            id="item-roll-value"
            class="input nameInput"
          />
        </div>
        <BaseButton
          @click="handleRecoveryShock"
          :disabled="buttonDisabled"
          class="primary wide mt-8"
        >
          {{
            checkSuccess
              ? "Whew! STR check succeeded!"
              : "Ouch! STR check failed!"
          }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import BaseModal from "../Base/BaseModal.vue";
import ToggleableDiceSection from "../Dice/ToggleableDiceSection.vue";
import BaseButton from "../Base/BaseButton.vue";
import { computed, reactive } from "vue";
import { defaultDice } from "@/utils/diceUtils";
import { useDiceStore } from "@/stores/dice";
import type { DisabledActions } from "@/utils/backendTypes";

const entityStore = useEntityStore();
const diceStore = useDiceStore();
const state = reactive({ rollValue: "" });

const diceComment = computed(
  () =>
    `STR check for handling recovery shock from ${
      entityStore.recoveryShockSrc && entityStore.recoveryShockSrc[0]
    }`
);
const dice = computed(() =>
  defaultDice(
    entityStore.entityAttributes,
    "str",
    diceStore.defaultDiceSettings,
    entityStore.diceToggles,
    diceComment.value
  )
);
const checkSuccess = computed(() => {
  const parsedValue = parseInt(state.rollValue);
  const roll = isNaN(parsedValue) ? 0 : parsedValue;
  return roll >= (entityStore.entityAttributes.recovery_shock?.val ?? 0);
});
const buttonDisabled = computed(() => !state.rollValue);

const rollValue = (value: number) => {
  state.rollValue = value.toString();
};
const closeModal = () => {
  state.rollValue = "";
  entityStore.recoveryShockSrc = entityStore.recoveryShockSrc?.slice(1);
};
const handleRecoveryShock = () => {
  if (!checkSuccess.value && entityStore.recoveryShockSrc) {
    const recoveryShockDisabledAction = {
      icon: "sick",
      msg: "You are immune to the benefits of this ability due to organ failure!",
    };
    const srcArray =
      (entityStore.entity?.entity.other_fields.disabled_actions ?? {})[
        entityStore.recoveryShockSrc[0]
      ] ?? [];
    const newDisabledActions: DisabledActions = {
      ...entityStore.entity?.entity.other_fields.disabled_actions,
      [entityStore.recoveryShockSrc[0]]: [
        ...srcArray,
        recoveryShockDisabledAction,
      ],
    };

    entityStore.updateEntity({
      other_fields: {
        ...entityStore.entity?.entity.other_fields,
        disabled_actions: newDisabledActions,
      },
    });
  }
  closeModal();
};
</script>
