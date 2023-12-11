<template>
  <BaseButton
    v-if="entityStore.inCombat"
    @click="startTurn"
    icon="sports_martial_arts"
    class="wide"
    >Start Turn</BaseButton
  >
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import BaseButton from "../Base/BaseButton.vue";
import { handleEndTimePeriod } from "@/utils/combatUtils";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import type { EntityAttribute, PartialEntityAttributes } from "vennt-library";

const entityStore = useEntityStore();

const startTurn = () => {
  if (!entityStore.entity) {
    return;
  }
  const attrGenerator = (
    key: EntityAttribute,
    currentVal: number,
    valOnTurn: number,
    damageKey: EntityAttribute,
    damageAmount?: number,
  ): PartialEntityAttributes => {
    const attrs: PartialEntityAttributes = {};
    let baseAdjust = Math.max(Math.min(valOnTurn - currentVal, valOnTurn), 0);
    if (damageAmount && damageAmount !== 0) {
      let damageAdjust = 0;
      if (damageAmount >= baseAdjust) {
        damageAdjust = -baseAdjust;
        baseAdjust = 0;
      } else {
        damageAdjust = -damageAmount;
        baseAdjust -= damageAmount;
      }
      if (damageAdjust !== 0) {
        attrs[damageKey] = damageAdjust;
      }
    }
    if (baseAdjust !== 0) {
      attrs[key] = baseAdjust;
    }
    return attrs;
  };

  const currentActions = entityStore.computedAttributes.actions?.val ?? 0;
  const actionsOnTurn =
    entityStore.computedAttributes.actions_on_turn?.val ?? 3;
  const stun = entityStore.computedAttributes.stun?.val;

  const currentReactions = entityStore.computedAttributes.reactions?.val ?? 0;
  const reactionsOnTurn =
    entityStore.computedAttributes.reactions_on_turn?.val ?? 1;
  const paralysis = entityStore.computedAttributes.paralysis?.val;

  const attrs = {
    ...attrGenerator("actions", currentActions, actionsOnTurn, "stun", stun),
    ...attrGenerator(
      "reactions",
      currentReactions,
      reactionsOnTurn,
      "paralysis",
      paralysis,
    ),
  };

  handleEndTimePeriod("turn");
  adjustAttrsAPI(entityStore.entity, entityStore.computedAttributes, attrs, {
    msg: "Start combat turn",
  });
};
</script>
