<template>
  <div
    v-if="entityStore.entity?.entity.other_fields.in_combat"
    class="alignRow gap wide mb-16 time-buttons"
  >
    <BaseButton @click="startRound" icon="refresh" class="wide"
      >Start Round</BaseButton
    >
    <BaseButton @click="startTurn" icon="sports_martial_arts" class="wide"
      >Start Turn</BaseButton
    >
    <BaseButton @click="toggleInCombat" icon="close" class="wide"
      >End Combat</BaseButton
    >
  </div>
  <div v-else class="alignRow gap wide mb-16 time-buttons">
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
    ...(burning && { burning: -burning }),
    ...(bleeding && { bleeding: -bleeding }),
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
  const currentActions = entityStore.entityAttributes.actions?.val ?? 0;
  const currentReactions = entityStore.entityAttributes.reactions?.val ?? 0;
  const actionsOnTurn = entityStore.entityAttributes.actions_on_turn?.val ?? 3;
  const reactionsOnTurn =
    entityStore.entityAttributes.reactions_on_turn?.val ?? 1;

  const actions = actionsOnTurn - currentActions;
  const reactions = reactionsOnTurn - currentReactions;
  const attrs = {
    ...(actions !== 0 && { actions }),
    ...(reactions !== 0 && { reactions }),
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

  /*
  const reset_actions = entityStore.entityAttributes.actions?.base;
  const reset_reactions = entityStore.entityAttributes.reactions?.base;
  const attrs = {
    ...(reset_actions && { actions: -reset_actions }),
    ...(reset_reactions && { reactions: -reset_reactions }),
  };
  adjustAttrsAPI(
    entityStore.entity,
    entityStore.entityAttributes,
    attrs,
    "Reset actions / reactions for combat"
  );
  */
};
</script>

<style scoped>
@container page (max-width: 600px) {
  .time-buttons {
    flex-direction: column;
  }
}
</style>
