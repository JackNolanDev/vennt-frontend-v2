<template>
  <div v-if="entityStore.inCombat" class="alignRow wide mb-16 time-buttons">
    <BaseButton @click="startRound" icon="refresh" class="wide"
      >Start Round</BaseButton
    >
    <BaseButton @click="startTurn" icon="sports_martial_arts" class="wide"
      >Start Turn</BaseButton
    >
    <BaseButton
      @click="toggleInCombat"
      icon="flag"
      class="wide"
      :disabled="!entityStore.entity?.entity.other_fields.in_combat"
      >End Combat</BaseButton
    >
  </div>
  <div v-else class="alignRow wide mb-16 time-buttons">
    <BaseButton @click="toggleInCombat" icon="swords" class="wide"
      >Start Combat</BaseButton
    >
    <BaseButton
      @click="handleEndTimePeriod('encounter')"
      icon="curtains"
      class="wide"
      >End Scene</BaseButton
    >
    <BaseButton @click="handleEndTimePeriod('rest')" icon="bed" class="wide"
      >Rest</BaseButton
    >
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import BaseButton from "../Base/BaseButton.vue";
import { handleEndTimePeriod } from "@/utils/combatUtils";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import type {
  EntityAttribute,
  PartialEntityAttributes,
} from "@/utils/backendTypes";

const entityStore = useEntityStore();

const startRound = () => {
  // apply bleeding / burning damage
  if (!entityStore.entity) {
    return;
  }
  const burning = entityStore.entityAttributes.burning?.val;
  const bleeding = entityStore.entityAttributes.bleeding?.val;
  const hp_diff = -(burning ?? 0) - (bleeding ?? 0);
  const attrs = {
    ...(hp_diff && { hp: hp_diff }),
    ...(burning && { burning: -Math.min(burning, 3) }),
  };
  adjustAttrsAPI(
    entityStore.entity,
    entityStore.entityAttributes,
    attrs,
    "Start combat round (applied burning & bleeding)"
  );
};

const startTurn = () => {
  if (!entityStore.entity) {
    return;
  }
  const attrGenerator = (
    key: EntityAttribute,
    currentVal: number,
    valOnTurn: number,
    damageKey: EntityAttribute,
    damageAmount?: number
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

  const currentActions = entityStore.entityAttributes.actions?.val ?? 0;
  const actionsOnTurn = entityStore.entityAttributes.actions_on_turn?.val ?? 3;
  const stun = entityStore.entityAttributes.stun?.val;

  const currentReactions = entityStore.entityAttributes.reactions?.val ?? 0;
  const reactionsOnTurn =
    entityStore.entityAttributes.reactions_on_turn?.val ?? 1;
  const paralysis = entityStore.entityAttributes.paralysis?.val;

  const attrs = {
    ...attrGenerator("actions", currentActions, actionsOnTurn, "stun", stun),
    ...attrGenerator(
      "reactions",
      currentReactions,
      reactionsOnTurn,
      "paralysis",
      paralysis
    ),
  };

  handleEndTimePeriod("turn");
  adjustAttrsAPI(
    entityStore.entity,
    entityStore.entityAttributes,
    attrs,
    "Start combat turn"
  );
};

const toggleInCombat = () => {
  if (!entityStore.entity) {
    return;
  }
  const in_combat = !entityStore.entity.entity.other_fields.in_combat;
  const other_fields = {
    ...entityStore.entity.entity.other_fields,
    in_combat,
  };
  const attributes = {
    ...entityStore.entity.entity.attributes,
    actions: 0,
    reactions: 0,
  };
  entityStore.updateEntity({ other_fields, attributes });
  entityStore.clearChangelog(["actions", "reactions"]);
  handleEndTimePeriod("encounter");
};
</script>

<style scoped>
@container page (max-width: 600px) {
  .time-buttons {
    flex-direction: column;
  }
}
</style>
