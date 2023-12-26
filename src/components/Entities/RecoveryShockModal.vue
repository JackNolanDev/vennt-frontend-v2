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
    <RollDiceInput
      v-model="state.rollValue"
      :dice="dice"
      input-placeholder="Roll Result"
    >
      <template #title
        ><p class="m-8">
          Roll a Strength check! If the result is less than your Recovery Shock
          ({{ entityStore.computedAttributes.recovery_shock?.val ?? 0 }}), you
          become permanently immune to the benefits of the spell or potion which
          just affected you!
        </p></template
      >
      <template #innerForm
        ><BaseButton
          @click="handleRecoveryShock"
          :disabled="buttonDisabled"
          class="primary wide mt-8"
        >
          {{
            checkSuccess
              ? "Whew! STR check succeeded!"
              : "Ouch! STR check failed!"
          }}
        </BaseButton></template
      >
    </RollDiceInput>
  </BaseModal>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import BaseModal from "../Base/BaseModal.vue";
import BaseButton from "../Base/BaseButton.vue";
import { computed, reactive } from "vue";
import { useDiceStore } from "@/stores/dice";
import { type DisabledActions, defaultDice } from "vennt-library";
import RollDiceInput from "../Dice/RollDiceInput.vue";
import { numberFieldVal } from "@/utils/inputType";

const entityStore = useEntityStore();
const diceStore = useDiceStore();
const state = reactive({ rollValue: "" });

const dice = computed(() =>
  defaultDice(
    entityStore.computedAttributes,
    "str",
    diceStore.defaultDiceSettings,
    entityStore.diceToggles,
    `STR check for handling recovery shock from ${
      entityStore.recoveryShockSrc && entityStore.recoveryShockSrc[0]
    }`,
  ),
);
const checkSuccess = computed(() => {
  const roll = numberFieldVal(state.rollValue);
  return roll >= (entityStore.computedAttributes.recovery_shock?.val ?? 0);
});
const buttonDisabled = computed(() => !state.rollValue);

const closeModal = () => {
  state.rollValue = "";
  entityStore.recoveryShockSrc = entityStore.recoveryShockSrc?.slice(1);
};
const handleRecoveryShock = () => {
  if (!checkSuccess.value && entityStore.recoveryShockSrc) {
    const recoveryShockDisabledAction = {
      icon: "sick",
      msg: `You are immune to "${entityStore.recoveryShockSrc[0]}" due to organ failure!`,
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
