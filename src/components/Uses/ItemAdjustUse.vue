<template>
  <BaseButton
    @click="useItem"
    :disabled="
      ((entityStore.entity?.entity.other_fields.disabled_actions ?? {})[
        item.name
      ]?.length ?? 0) > 0
    "
    title="Activates the item's use"
    class="primary wide mb-8"
    >Consume Item</BaseButton
  >
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "vennt-library";
import BaseButton from "../Base/BaseButton.vue";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ item: ConsolidatedItem }>();
const entityStore = useEntityStore();

const useItem = () => {
  entityStore.updateItem(props.item.id, { active: true });
};
</script>
