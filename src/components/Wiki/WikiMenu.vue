<template>
  <div v-for="[path, map] in sortedTree" :key="path">
    <BaseDropDown v-if="Object.keys(map.children).length > 0" :title="path">
      <div class="ml-16">
        <BaseButton
          :to="{
            name: WIKI_PATHS_SPECIFIC_ROUTE,
            params: { path: stringToLinkID(path) },
          }"
          icon="link"
          class="wide"
          >{{ path }}</BaseButton
        >
        <WikiMenu :tree="map.children"></WikiMenu>
      </div>
    </BaseDropDown>
    <BaseButton
      v-else-if="map.abilities.length > 0"
      :to="{
        name: WIKI_PATHS_SPECIFIC_ROUTE,
        params: { path: stringToLinkID(path) },
      }"
      icon="link"
      class="wide"
      >{{ path }}</BaseButton
    >
  </div>
</template>

<script setup lang="ts">
import { WIKI_PATHS_SPECIFIC_ROUTE } from "@/router";
import type { PathTree } from "@/utils/backendTypes";
import { stringToLinkID } from "@/utils/textUtils";
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import BaseDropDown from "../Base/BaseDropDown.vue";

const props = defineProps<{ tree: PathTree }>();

const sortedTree = computed(() =>
  Object.entries(props.tree).sort(([pathA, mapA], [pathB, mapB]) => {
    const AChildren = Object.keys(mapA.children).length > 0;
    const BChildren = Object.keys(mapB.children).length > 0;
    if (AChildren && !BChildren) {
      return -1;
    } else if (!AChildren && BChildren) {
      return 1;
    }
    return pathA.localeCompare(pathB);
  })
);
</script>
