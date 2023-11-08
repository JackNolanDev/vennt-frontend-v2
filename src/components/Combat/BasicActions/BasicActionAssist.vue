<template>
  <h2>Assist</h2>
  <p>
    To assist, explain how you help an ally with a check and roll the same check
    as the ally you're helping. You may spend X MP or twice as much Vim (as
    narratively appropriate) to gain +Xd6 to your roll. If you roll equal to or
    higher than your ally, they gain +3 to their check. If you roll lower, they
    lose -3. (For subsequent assists, compare to the ally's new value rather
    than their original roll. Explanations of assists should reflect the
    intensity of how much Vim/MP you spend on the assist.)
  </p>
  <div class="separator mt-8 mb-8"></div>
  <form v-if="entityStore.canEdit">
    <div class="alignRow">
      <label for="basic-action-assist-attr" class="nowrap label-text label-min">
        Check Attribute:
      </label>
      <select v-model="state.attr" id="basic-action-assist-attr" class="input">
        <option v-for="attr in ATTRIBUTES" :key="attr" :value="attr">
          {{ attrFullName(attr) }}
        </option>
      </select>
    </div>
    <div class="alignRow mt-4">
      <label for="basic-action-assist-dice" class="nowrap label-text label-min">
        Bonus Dice:
      </label>
      <input
        type="number"
        inputmode="numeric"
        min="0"
        :max="bonusDiceMax"
        v-model.number="state.bonusDice"
        placeholder="0"
        title="number of incoming attacks"
        id="basic-action-assist-dice"
        class="input"
      />
    </div>
    <BaseCheckBox
      @click="state.useVim = !state.useVim"
      :checked="state.useVim"
      :use-toggle="true"
      class="wide mt-4"
      >Using {{ state.useVim ? "Vim" : "MP" }} (switch to
      {{ state.useVim ? "MP" : "Vim" }})</BaseCheckBox
    >
    <div class="card mt-8 padded thin column">
      <ToggleableDiceSectionCopyable
        :attr="state.attr"
        :dice="dice"
        :comment="comment"
        :header="true"
        :use-dice-as-header="true"
      ></ToggleableDiceSectionCopyable>
    </div>
    <BaseButton @click="spendAssistResources" class="primary center wide mt-8"
      >Spend
      {{
        bonusDiceAmount
          ? state.useVim
            ? bonusDiceAmount * 2
            : bonusDiceAmount
          : "no"
      }}
      {{ state.useVim ? "Vim" : "MP" }}</BaseButton
    >
  </form>
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseCheckBox from "@/components/Base/BaseCheckBox.vue";
import ToggleableDiceSectionCopyable from "@/components/Dice/ToggleableDiceSectionCopyable.vue";
import { useDiceStore } from "@/stores/dice";
import { useEntityStore } from "@/stores/entity";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import {
  ATTRIBUTES,
  defaultDice,
  combineDiceSettings,
  attrFullName,
  attrShortName,
  type EntityAttribute,
  type PartialEntityAttributes,
} from "vennt-library";
import { numberFieldVal } from "@/utils/inputType";
import { computed, reactive } from "vue";

const state = reactive<{
  attr: EntityAttribute;
  bonusDice: string | number;
  useVim: boolean;
}>({ attr: "per", bonusDice: "", useVim: false });
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const bonusDiceMax = computed(
  () =>
    (state.useVim
      ? Math.floor((entityStore.computedAttributes.vim?.val ?? 0) / 2)
      : entityStore.computedAttributes.mp?.val) ?? 1000,
);
const comment = computed(() => `${attrShortName(state.attr)} assist`);
const bonusDiceAmount = computed(() =>
  Math.max(Math.min(numberFieldVal(state.bonusDice), bonusDiceMax.value), 0),
);
const dice = computed(() =>
  defaultDice(
    entityStore.computedAttributes,
    state.attr,
    combineDiceSettings(
      diceStore.defaultDiceSettings,
      { count: bonusDiceAmount.value },
      entityStore.computedAttributes,
    ),
    entityStore.diceToggles,
    comment.value,
  ),
);

const spendAssistResources = () => {
  if (!entityStore.entity || bonusDiceAmount.value <= 0) {
    return;
  }
  const adjust: PartialEntityAttributes = {};
  if (state.useVim) {
    adjust.vim = -(bonusDiceAmount.value * 2);
  } else {
    adjust.mp = -bonusDiceAmount.value;
  }
  adjustAttrsAPI(entityStore.entity, entityStore.computedAttributes, adjust, {
    msg: `${bonusDiceAmount.value} bonus dice for ${comment.value}`,
  });
};
</script>

<style scoped>
.label-min {
  min-width: 180px;
}
</style>
