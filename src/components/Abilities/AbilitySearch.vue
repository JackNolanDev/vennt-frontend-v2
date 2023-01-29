<template>
  <label for="abiltiy-search"><h2>Add New Abilities</h2></label>
  <input
    placeholder="Search Ability"
    v-model="state.search"
    id="abiltiy-search"
    class="input abilityInput"
  />
  <div v-if="state.search.length > 0" class="card border padded column">
    <div class="searchTitle">Search suggestions:</div>
    <div v-if="searchResults.length > 0" class="searchScrollable">
      <BaseButton
        v-for="result in searchResults"
        :key="result.name"
        :to="abilityLink(result)"
        :id="stringToLinkID(result.name)"
        class="wide"
        >{{ improveTextForDisplay(result.name) }}</BaseButton
      >
    </div>
    <div v-else class="mt-8 errorText">(No Results Found)</div>
  </div>
</template>

<script setup lang="ts">
import { stringToLinkID, improveTextForDisplay } from "@/utils/textUtils";
import { useJsonStore } from "@/stores/jsonStorage";
import { computed, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import type { EntityAbility } from "@/utils/backendTypes";
import router, { ENTITY_ABILITIES_ROUTE } from "@/router";
import type { RouteLocationRaw } from "vue-router";
import { useEntityStore } from "@/stores/entity";

const state = reactive({ search: "" });
const entityStore = useEntityStore();
const jsonStorage = useJsonStore();
jsonStorage.fetchAbilities();

const lowercaseSearch = computed(() => state.search.toLowerCase());

const searchResults = computed(() => {
  if (state.search === "") {
    return [];
  }
  return jsonStorage.abilities.abilities
    .filter(
      (ability) =>
        ability.name.toLowerCase().includes(lowercaseSearch.value) &&
        !entityStore.abilityNames.includes(ability.name)
    )
    .slice(0, 15);
});

const abilityLink = (ability: EntityAbility): RouteLocationRaw => ({
  name: router.currentRoute.value.name ?? ENTITY_ABILITIES_ROUTE,
  params: { ...router.currentRoute.value.params, detail: ability.name },
  query: router.currentRoute.value.query,
});
</script>

<style scoped>
.searchTitle {
  margin: 4px;
  font-size: 11pt;
  color: var(--text-muted);
}
.searchScrollable {
  max-height: 260px;
  overflow-y: auto;
}
</style>
