<template>
  <RollDiceInput
    v-if="dice"
    v-model="state.rollValue"
    :dice="dice"
    input-placeholder="Roll Result"
  >
    <template #innerForm
      ><BaseButton
        @click="consumeItem"
        :disabled="buttonDisabled"
        title="Removes the item from your inventory and heals you by the given amount"
        class="primary wide mt-8"
      >
        Consume Item
      </BaseButton></template
    >
  </RollDiceInput>
</template>

<script setup lang="ts">
import BaseButton from "../Base/BaseButton.vue";
import RollDiceInput from "../Dice/RollDiceInput.vue";
import { useEntityStore } from "@/stores/entity";
import {
  type ConsolidatedItem,
  type PartialEntityAttributes,
  diceParseFromString,
  solvePendingEquations,
} from "vennt-library";
import { computed, reactive } from "vue";
import { useDiceStore } from "@/stores/dice";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import { prefixName } from "@/utils/textUtils";
import { numberFieldVal } from "@/utils/inputType";

const props = defineProps<{ item: ConsolidatedItem }>();
const state = reactive({ rollValue: "" });
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const dice = computed(
  () =>
    props.item.uses?.roll &&
    diceParseFromString(
      props.item.uses.roll.dice,
      diceStore.defaultDiceSettings,
      prefixName(props.item.name, "Used", false),
    ),
);
const adjust = computed(() => numberFieldVal(state.rollValue));
const buttonDisabled = computed(
  () =>
    adjust.value === 0 ||
    ((entityStore.entity?.entity.other_fields.disabled_actions ?? {})[
      props.item.name
    ]?.length ?? 0) > 0,
);

const consumeItem = () => {
  if (!entityStore.entity || !props.item.uses?.roll?.attr) {
    return;
  }
  let adjustAttrs: PartialEntityAttributes = {
    [props.item.uses.roll.attr]: adjust.value,
  };
  if (props.item.uses.roll.heal) {
    adjustAttrs = {
      ...adjustAttrs,
      ...solvePendingEquations(
        props.item.uses.roll.heal,
        entityStore.computedAttributes,
      ),
    };
  }
  adjustAttrsAPI(
    entityStore.entity,
    entityStore.computedAttributes,
    adjustAttrs,
    {
      msg: prefixName(props.item.name, "consumed", false),
      enforceMaximums: true,
      src: props.item.name,
    },
  );
  entityStore.deleteItem(props.item, true);
};
</script>
