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
    <div class="muted-text">{{ computedDice.roll20 }}</div>
  </div>
  <ToggleableDiceSection
    :dice="computedDice"
    :attr="attr"
    :only-show="useCopyableDice ? undefined : 'roll'"
    :hide-other-options="!useCopyableDice"
  ></ToggleableDiceSection>
</template>

<script setup lang="ts">
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
import ToggleableDiceSection from "../Dice/ToggleableDiceSection.vue";
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
const computedDice = computed(() => {
  return defaultDice(
    props.attrs,
    props.attr,
    diceStore.defaultDiceSettings,
    entityStore.diceToggles,
    `${attrShortName(props.attr)} check`,
  );
});
</script>

<style scoped>
.diceSection {
  min-height: 90px;
}
</style>
