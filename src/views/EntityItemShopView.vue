<template>
  <PageLayout>
    <h1>Item shop</h1>
    <div class="alignRow gap">
      <input
        placeholder="Item Search"
        v-model="state.itemSearchField"
        type="text"
        inputmode="search"
        id="item-search"
        class="input itemSearchInput"
      />
      <BaseButton @click="toggleShowSearchSettings" icon="filter_list"
        >Search Settings</BaseButton
      >
    </div>
    <div v-if="state.showSearchSettings" class="card column padded">
      <h4 class="mt-0 mb-0">Filter Item Types:</h4>
      <SetBasedCheckBoxArray
        :options="checkBoxOptions"
        :checked="state.checked"
      ></SetBasedCheckBoxArray>
    </div>
    <div v-for="(items, section) in sectionsMap" :key="section">
      <h2>{{ section }}</h2>
      <div class="card column table withHeader">
        <div class="alignRow tableData tableHeader sticky">
          <div class="itemName headerFont">
            <b>Item</b>
          </div>
          <div class="itemCost headerFont">
            <b>Cost</b>
          </div>
          <div class="itemDesc headerFont">
            <b>Description</b>
          </div>
        </div>
        <div
          v-for="item in items"
          :key="item.name"
          :id="stringToLinkID(item.name ?? item.type)"
          :class="{ selected: itemOpened(item) }"
          class="alignRow tableItems"
        >
          <div class="tableData">
            <div class="itemName">
              {{ improveTextForDisplay(item.name ?? item.type) }}
            </div>
            <div class="itemCost">{{ item.cost }}</div>
            <div class="itemDesc condense-child-text">
              <DisplayShopItemDesc :item="item"></DisplayShopItemDesc>
            </div>
          </div>
          <BaseButton
            :icon="
              itemOpened(item) ? 'keyboard_arrow_left' : 'keyboard_arrow_right'
            "
            :to="itemLink(item)"
          ></BaseButton>
        </div>
      </div>
    </div>
    <div class="mb-128"></div>
  </PageLayout>
</template>

<script setup lang="ts">
import { stringToLinkID, improveTextForDisplay } from "@/utils/textUtils";
import BaseButton from "@/components/Base/BaseButton.vue";
import SetBasedCheckBoxArray from "@/components/Base/SetBasedCheckBoxArray.vue";
import DisplayShopItemDesc from "@/components/Items/DisplayShopItemDesc.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import router, { ENTITY_ITEM_SHOP_ROUTE } from "@/router";
import { useJsonStore } from "@/stores/jsonStorage";
import type { EntityItemType, ShopItem } from "vennt-library";
import { computed, reactive } from "vue";
import type { RouteLocationRaw } from "vue-router";

// TODO: Speed up local version of this - live build seems to go fine.
// The slow thing locally seems to be the rendering, the filter logic is pretty quick

const state = reactive({
  itemSearchField: "",
  showSearchSettings: false,
  checked: new Set<string>(),
});
const jsonStorage = useJsonStore();
jsonStorage.fetchShopItems();

const checkBoxOptions: Record<EntityItemType, string> = {
  equipment: "Show Equipment",
  consumable: "Show Consumables",
  container: "Show Containers",
  armor: "Show Armor",
  shield: "Show Shields",
  weapon: "Show Weapons",
};

const sectionsMap = computed(() => {
  const sections: Record<string, ShopItem[]> = {};
  if (!jsonStorage.shopItems) {
    return sections;
  }
  jsonStorage.shopItems
    .filter(
      (item) =>
        (item.name
          ?.toLowerCase()
          .includes(state.itemSearchField.toLowerCase()) ||
          item.desc
            .toLowerCase()
            .includes(state.itemSearchField.toLowerCase())) &&
        (state.checked.size === 0 || state.checked.has(item.type)),
    )
    .forEach((item) => {
      if (item.section === undefined) {
        return;
      }
      if (item.section in sections) {
        sections[item.section].push(item);
      } else {
        sections[item.section] = [item];
      }
    });
  return sections;
});

const toggleShowSearchSettings = () => {
  state.showSearchSettings = !state.showSearchSettings;
};

const itemOpened = (item: ShopItem): boolean =>
  router.currentRoute.value.params.detail == item.name;
const itemLink = (item: ShopItem): RouteLocationRaw => {
  if (itemOpened(item)) {
    const params = { ...router.currentRoute.value.params };
    delete params.detail;
    return {
      name: ENTITY_ITEM_SHOP_ROUTE,
      params,
      query: router.currentRoute.value.query,
    };
  }
  return {
    name: ENTITY_ITEM_SHOP_ROUTE,
    params: { ...router.currentRoute.value.params, detail: item.name },
    query: router.currentRoute.value.query,
  };
};
</script>

<style scoped>
.itemSearchInput {
  max-width: 400px;
}

.itemName {
  width: 20%;
  font-size: 14pt;
}
.itemCost {
  width: 10%;
  font-size: 14pt;
}
.itemDesc {
  width: 70%;
}

.main.bp750 .itemName {
  width: 35%;
}
.main.bp750 .itemCost {
  display: 5%;
}
.main.bp750 .itemDesc {
  width: 60%;
}
</style>
