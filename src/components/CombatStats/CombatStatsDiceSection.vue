<template>
  <div class="alignRow split mb-8">
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
      Roll {{ attrShortName(attr) }}
    </BaseButton>
    <div v-else class="muted-text">{{ computedDice.roll20 }}</div>
  </div>
  <div v-if="!useCopyableDice" class="diceSection">
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
  <ToggleableDiceSectionCopyable
    v-else
    :dice="computedDice"
    :attr="attr"
  ></ToggleableDiceSectionCopyable>
</template>

<script setup lang="ts">
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { useDiceStore } from "@/stores/dice";
import {
  ATTRIBUTES_SET,
  defaultDice,
  type ComputedAttributes,
  type EntityAttribute,
  attrFullName,
  attrShortName,
} from "vennt-library";
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import DiceRender from "../Dice/DiceRender.vue";
import ToggleableDiceSectionCopyable from "../Dice/ToggleableDiceSectionCopyable.vue";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{
  attrs: ComputedAttributes;
  attr: EntityAttribute;
  useCopyableDice: boolean;
}>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const isBaseAttribute = computed(() => {
  return ATTRIBUTES_SET.has(props.attr);
});
const attrLink = computed(() => {
  return `https://vennt.fandom.com/wiki/${attrFullName(
    props.attr,
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
    entityStore.diceToggles,
    `${attrShortName(props.attr)} check`,
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
