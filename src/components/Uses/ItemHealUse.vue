<template>
  <BaseButton
    @click="useItem"
    title="Removes the item from your inventory and heals you by the given amount"
    class="primary wide mb-8"
    >Consume Item</BaseButton
  >
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "@/utils/backendTypes";
import BaseButton from "../Base/BaseButton.vue";
import { adjustAttrsAPI, solvePendingEquations } from "@/utils/attributeUtils";
import { useEntityStore } from "@/stores/entity";
import { prefixName } from "@/utils/textUtils";

const props = defineProps<{ item: ConsolidatedItem }>();
const entityStore = useEntityStore();

const useItem = () => {
  if (entityStore.entity && props.item.uses?.heal) {
    adjustAttrsAPI(
      entityStore.entity,
      entityStore.entityAttributes,
      solvePendingEquations(
        props.item.uses.heal.attr,
        entityStore.entityAttributes
      ),
      prefixName(props.item.name, "consumed", false),
      true,
      true
    );
    entityStore.deleteItem(props.item, true);
  }
};
</script>
