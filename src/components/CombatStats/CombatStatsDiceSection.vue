<template>
  <div class="alignRow split">
    <div class="labelText stronger">
      <a
        v-if="isBaseAttribute"
        v-bind:href="attrLink"
        target="_blank"
        class="stealth"
        >{{ attrFullName(attr) }}</a
      >
      <span v-else>{{ attrFullName(attr) }}</span>
      (
      <span class="number">{{ attrDisplayVal }}</span>
      )
    </div>
    <BaseButton
      v-if="!useCopyableDice"
      @click="rollButton"
      :title="computedDice.web"
      icon="casino"
      class="selected"
    >
      Roll {{ attr.toUpperCase() }}
    </BaseButton>
  </div>
  <div v-if="!useCopyableDice" class="diceSection mt-8">
    <div v-if="latestRoll">
      <DiceRender :roll="latestRoll"></DiceRender>
      <div>
        Dice Rolled:
        <span class="number">{{ latestRoll.notation }}</span>
      </div>
      <div>
        Average Roll:
        <span class="number">{{ latestRoll.averageTotal }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { useDiceStore } from "@/stores/dice";
import { attrFullName } from "@/utils/attributeUtils";
import {
  ATTRIBUTES_SET,
  type EntityAttribute,
  type UpdatedEntityAttributes,
} from "@/utils/backendTypes";
import { defaultDice } from "@/utils/diceUtils";
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import DiceRender from "../Dice/DiceRender.vue";

const props = defineProps<{
  attrs: UpdatedEntityAttributes;
  attr: EntityAttribute;
  useCopyableDice: boolean;
}>();
const diceStore = useDiceStore();

const isBaseAttribute = computed(() => {
  return ATTRIBUTES_SET.has(props.attr);
});
const attrLink = computed(() => {
  return `https://vennt.fandom.com/wiki/${attrFullName(
    props.attr
  )}_(${props.attr.toUpperCase()})`;
});
const attrDisplayVal = computed(() => {
  const map = props.attrs[props.attr];
  return map === undefined ? undefined : map.val;
});
const latestRoll = computed(() => {
  return diceStore.latestRoll[props.attr];
});
const computedDice = computed(() => {
  return defaultDice(
    props.attrs,
    props.attr,
    diceStore.defaultDiceSettings,
    {} // TODO: fetch diceToggles from character store, probably
  );
});

const rollButton = () => {
  diceStore.updateLatestRoll(props.attr, new DiceRoll(computedDice.value.web));
};
</script>

<style scoped>
.diceSection {
  min-height: 90px;
}
</style>
