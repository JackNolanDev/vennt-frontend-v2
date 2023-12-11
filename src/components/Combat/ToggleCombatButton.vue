<template>
  <BaseButton
    v-if="entityStore.inCombat"
    @click="toggleInCombat"
    icon="flag"
    class="wide"
    :disabled="!entityStore.entity?.entity.other_fields.in_combat"
    >End Combat</BaseButton
  >
  <BaseButton v-else @click="toggleInCombat" icon="swords" class="wide"
    >Start Combat</BaseButton
  >
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import BaseButton from "../Base/BaseButton.vue";
import { handleEndTimePeriod } from "@/utils/combatUtils";

const entityStore = useEntityStore();

const toggleInCombat = async () => {
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
  handleEndTimePeriod("encounter");
  await entityStore.updateEntity({ other_fields, attributes });
  entityStore.clearChangelog(["actions", "reactions"]);
};
</script>
