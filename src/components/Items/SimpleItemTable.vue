<template>
  <div class="card column">
    <div v-if="title" class="tableItems noHeader padded">
      <h3 class="mt-0 mb-0 text-center">{{ title }}</h3>
    </div>
    <div
      v-for="(item, index) in items"
      v-bind:key="item.name + index"
      class="tableItems noHeader padded"
    >
      <h3 class="mt-0 mb-8">
        <RouterLink
          v-if="linkOnName && (item as FullEntityItem).id"
          :to="itemRoute(item as FullEntityItem)"
          class="stealth"
          >{{ improveTextForDisplay(item.name) }}</RouterLink
        ><span v-else>{{ improveTextForDisplay(item.name) }}</span>
      </h3>
      <p class="mt-0 mb-0 condense-child-text">
        <ItemDesc :item="item"></ItemDesc>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import router, { ENTITY_ITEMS_ROUTE } from "@/router";
import type { EntityItem, FullEntityItem } from "@/utils/backendTypes";
import { improveTextForDisplay } from "@/utils/textUtils";
import { type RouteLocationRaw, RouterLink } from "vue-router";
import ItemDesc from "./ItemDesc.vue";

defineProps<{
  items: EntityItem[];
  linkOnName?: boolean;
  title?: string;
}>();

const itemRoute = (item: FullEntityItem): RouteLocationRaw => {
  return {
    name: ENTITY_ITEMS_ROUTE,
    params: { detail: item.id },
    query: router.currentRoute.value.query,
  };
};
</script>
