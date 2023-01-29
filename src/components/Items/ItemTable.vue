<template>
  <div v-if="items.length > 0" class="card column" :class="{ hideCount }">
    <div class="alignRow tableData tableHeader">
      <div class="itemName headerFont">
        <b>{{ itemLabel }}</b>
      </div>
      <div class="itemCount headerFont">
        <b>Count</b>
      </div>
      <div class="itemDesc headerFont">
        <b>Description</b>
      </div>
    </div>
    <div
      v-for="item in items"
      :key="item.id"
      :id="stringToLinkID(item.id)"
      :class="{ selected: itemOpened(item) }"
      class="alignRow tableItems"
    >
      <div class="tableData">
        <div class="itemName">{{ improveTextForDisplay(item.name) }}</div>
        <div class="itemCount number">{{ item.ids.length }}</div>
        <div class="itemDesc"><ItemDesc :item="item"></ItemDesc></div>
      </div>
      <BaseButton
        :icon="
          itemOpened(item) ? 'keyboard_arrow_left' : 'keyboard_arrow_right'
        "
        :to="itemLink(item)"
      ></BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { stringToLinkID, improveTextForDisplay } from "@/utils/textUtils";
import type { ConsolidatedItem } from "@/utils/backendTypes";
import BaseButton from "../Base/BaseButton.vue";
import router, { ENTITY_ITEMS_ROUTE } from "@/router";
import type { RouteLocationRaw } from "vue-router";
import ItemDesc from "./ItemDesc.vue";

withDefaults(
  defineProps<{
    items: ConsolidatedItem[];
    itemLabel?: string;
    hideCount?: boolean;
  }>(),
  { itemLabel: "Item", hideCount: false }
);

const itemOpened = (item: ConsolidatedItem): boolean =>
  router.currentRoute.value.params.detail === item.id;
const itemLink = (item: ConsolidatedItem): RouteLocationRaw => {
  if (itemOpened(item)) {
    const params = { ...router.currentRoute.value.params };
    delete params.detail;
    return {
      name: router.currentRoute.value.name ?? ENTITY_ITEMS_ROUTE,
      params,
      query: router.currentRoute.value.query,
    };
  }
  return {
    name: router.currentRoute.value.name ?? ENTITY_ITEMS_ROUTE,
    params: { ...router.currentRoute.value.params, detail: item.id },
    query: router.currentRoute.value.query,
  };
};
</script>

<style scoped>
.itemName {
  width: 20%;
  font-size: 14pt;
}
.itemCount {
  width: 10%;
  font-size: 14pt;
}
.itemDesc {
  width: 70%;
}

.hideCount .itemCount {
  display: none;
}
.hideCount .itemDesc {
  width: 80%;
}

/* Deep selector effects children */
.itemDesc >>> p:first-child {
  margin-top: 0px;
  margin-bottom: 0px;
}
.itemDesc >>> p,
.itemDesc >>> ul {
  /* reduce margin so we can condense text a bit more */
  margin-top: 5px;
  margin-bottom: 0px;
}

@container page (max-width: 750px) {
  .itemName {
    width: 40%;
  }
  .itemCount {
    display: none;
  }
  .itemDesc {
    width: 60%;
  }
}
</style>
