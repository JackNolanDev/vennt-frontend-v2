<template>
  <BaseDropDown v-if="children.length > 0" :title="path" class="hide-extra">
    <div class="ml-16">
      <BaseButton
        :to="{
          name: WIKI_PATHS_SPECIFIC_ROUTE,
          params: { path: stringToLinkID(path) },
          query: $router.currentRoute.value.query,
        }"
        icon="link"
        class="wide"
        >{{ path }}</BaseButton
      >
      <WikiMenu
        v-for="child in children"
        :key="`${path}-${child}`"
        :path="child"
      ></WikiMenu>
    </div>
  </BaseDropDown>
  <BaseButton
    v-else
    :to="{
      name: WIKI_PATHS_SPECIFIC_ROUTE,
      params: { path: stringToLinkID(path) },
      query: $router.currentRoute.value.query,
    }"
    icon="link"
    class="wide hide-extra"
    >{{ path }}</BaseButton
  >
</template>

<script setup lang="ts">
import { WIKI_PATHS_SPECIFIC_ROUTE } from "@/router";
import { useJsonStore } from "@/stores/jsonStorage";
import { stringToLinkID } from "@/utils/textUtils";
import { sortWikiPaths } from "@/utils/wikiUtils";
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import BaseDropDown from "../Base/BaseDropDown.vue";

const props = defineProps<{ path: string }>();
const jsonStorage = useJsonStore();

const children = computed(() =>
  sortWikiPaths(jsonStorage.pathGraph.adjacent(props.path))
);
</script>
