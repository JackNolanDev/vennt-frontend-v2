<template>
  <BaseButton
    v-if="entityStore.inCombat"
    @click="startRound"
    icon="refresh"
    class="wide"
    >Start Round</BaseButton
  >
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import BaseButton from "../Base/BaseButton.vue";
import { adjustAttrsAPI } from "@/utils/attributeUtils";

const entityStore = useEntityStore();

const startRound = () => {
  // apply bleeding / burning damage
  if (!entityStore.entity) {
    return;
  }
  const burning = entityStore.computedAttributes.burning?.val;
  const bleeding = entityStore.computedAttributes.bleeding?.val;
  const hp_diff = -(burning ?? 0) - (bleeding ?? 0);
  const attrs = {
    ...(hp_diff && { hp: hp_diff }),
    ...(burning && { burning: -Math.min(burning, 3) }),
  };
  if (Object.keys(attrs).length === 0) {
    return;
  }
  adjustAttrsAPI(entityStore.entity, entityStore.computedAttributes, attrs, {
    msg: "Start combat round (applied burning & bleeding)",
  });
};
</script>
