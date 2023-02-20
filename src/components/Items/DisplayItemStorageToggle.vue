<template>
  <div>
    <BaseButton
      v-if="!item.custom_fields?.in_storage"
      title="Items in storage do not add to your bulk, but cannot be accessed easily"
      @click="toggleInStorage"
      icon="archive"
      class="wide"
    >
      Store Item
    </BaseButton>
    <BaseButton
      v-else
      title="Fetch an item from storage so it can be used"
      @click="toggleInStorage"
      icon="unarchive"
      class="wide"
    >
      Retrieve Item
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "@/utils/backendTypes";
import BaseButton from "../Base/BaseButton.vue";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ item: ConsolidatedItem }>();
const entityStore = useEntityStore();

const toggleInStorage = () => {
  if (!props.item.custom_fields) {
    const itemUpdate = { custom_fields: { in_storage: true } };
    entityStore.updateItem(props.item.id, itemUpdate);
  } else {
    const custom_fields = {
      ...props.item.custom_fields,
      in_storage: !props.item.custom_fields.in_storage,
    };
    const itemUpdate = { custom_fields };
    entityStore.updateItem(props.item.id, itemUpdate);
  }
};
</script>
