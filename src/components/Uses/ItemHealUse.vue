<template>
  <BaseButton
    @click="useItem"
    :disabled="
      ((entityStore.entity?.entity.other_fields.disabled_actions ?? {})[
        item.name
      ]?.length ?? 0) > 0
    "
    title="Removes the item from your inventory and heals you by the given amount"
    class="primary wide mb-8"
    >Consume Item</BaseButton
  >
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "vennt-library";
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
      {
        msg: prefixName(props.item.name, "consumed", false),
        enforceMaximums: true,
        src: props.item.name,
      }
    );
    entityStore.deleteItem(props.item, true);
  }
};
</script>
