<template>
  <BaseButton @click="applyBleeding" icon="water_drop" class="wide"
    >Apply {{ entityStore.computedAttributes.bleeding?.val }} Bleeding
    Damage</BaseButton
  >
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import BaseButton from "../Base/BaseButton.vue";

const entityStore = useEntityStore();

const applyBleeding = () => {
  if (!entityStore.entity) {
    return;
  }
  const bleeding = entityStore.computedAttributes.bleeding?.val;
  if (bleeding && bleeding > 0) {
    adjustAttrsAPI(
      entityStore.entity,
      entityStore.computedAttributes,
      { hp: -bleeding },
      { msg: `Took ${bleeding} bleeding damage` },
    );
  }
};
</script>
