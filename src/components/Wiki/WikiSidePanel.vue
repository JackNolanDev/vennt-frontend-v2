<template>
  <div v-if="entity" class="ml-16">
    <h2>Paths for {{ entity.name }}</h2>
    <EntitySpentXP></EntitySpentXP>
  </div>
  <h2 v-else class="ml-16">Paths</h2>
  <WikiMenu
    v-for="path in basePaths"
    :key="`base-${path}`"
    :path="path"
  ></WikiMenu>
</template>

<script setup lang="ts">
import router from "@/router";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { sortWikiPaths } from "@/utils/wikiUtils";
import { computed } from "vue";
import EntitySpentXP from "../Entities/EntitySpentXP.vue";
import WikiMenu from "./WikiMenu.vue";

const jsonStorage = useJsonStore();
const entityStore = useEntityStore();

const entity = computed(() => {
  if (
    entityStore.entity &&
    entityStore.entity.entity.id === router.currentRoute.value.query.entity
  ) {
    return entityStore.entity.entity;
  }
  return null;
});
const basePaths = computed(() =>
  sortWikiPaths(
    jsonStorage.pathGraph
      .nodes()
      .filter((node) => jsonStorage.pathGraph.indegree(node) === 0)
  )
);
</script>
