<template>
  <ItemDetails v-if="entityItem" :item="entityItem"></ItemDetails>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import ItemDetails from "../Items/ItemDetails.vue";
import { computed } from "vue";
import router from "@/router";

const entityStore = useEntityStore();

const entityItem = computed(() =>
  entityStore.consolidatedItems.find(
    (item) => item.id === router.currentRoute.value.params.detail
  )
);
</script>
