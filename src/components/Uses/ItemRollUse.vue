<template>
  <div v-if="dice" class="card column">
    <ToggleableDiceSection
      :dice="dice"
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
          inputmode="numeric"
          placeholder="Roll Result"
          v-model="state.rollValue"
          id="item-roll-value"
          class="input nameInput"
        />
      </div>
      <BaseButton
        @click="consumeItem"
        :disabled="buttonDisabled"
        title="Removes the item from your inventory and heals you by the given amount"
        class="primary wide mt-8"
      >
        Consume Item
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import type { ConsolidatedItem } from "@/utils/backendTypes";
import ToggleableDiceSection from "../Dice/ToggleableDiceSection.vue";
import { computed, reactive } from "vue";
import { useDiceStore } from "@/stores/dice";
import { diceParseFromString } from "@/utils/diceUtils";
import BaseButton from "../Base/BaseButton.vue";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import { prefixName } from "@/utils/textUtils";

const props = defineProps<{ item: ConsolidatedItem }>();
const state = reactive({ rollValue: "" });
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const dice = computed(
  () =>
    props.item.uses?.roll &&
    diceParseFromString(
      props.item.uses.roll.dice,
      diceStore.defaultDiceSettings
    )
);
const adjust = computed(() => {
  const parsedValue = parseInt(state.rollValue);
  return isNaN(parsedValue) ? 0 : parsedValue;
});
const buttonDisabled = computed(() => adjust.value === 0);

const rollValue = (value: number) => {
  state.rollValue = value.toString();
};
const consumeItem = () => {
  if (!entityStore.entity || !props.item.uses?.roll?.attr) {
    return;
  }
  adjustAttrsAPI(
    entityStore.entity,
    { [props.item.uses.roll.attr]: adjust.value },
    prefixName(props.item.name, "consumed", false),
    true,
    true
  );
  entityStore.deleteItem(props.item, true);
};
</script>
