<template>
  <BaseButton @click="applyBurning" icon="local_fire_department" class="wide"
    >Apply {{ entityStore.entityAttributes.burning?.val }} Burning
    Damage</BaseButton
  >
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import BaseButton from "../Base/BaseButton.vue";

const entityStore = useEntityStore();

const applyBurning = () => {
  if (!entityStore.entity) {
    return;
  }
  const burning = entityStore.entityAttributes.burning?.val;
  if (burning && burning > 0) {
    adjustAttrsAPI(
      entityStore.entity,
      entityStore.entityAttributes,
      {
        hp: -burning,
        burning: -Math.min(burning, 3),
      },
      `Took ${burning} burning damage`
    );
  }
};
</script>
