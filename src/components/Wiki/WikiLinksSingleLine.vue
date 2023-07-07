<template>
  <span v-for="(split, idx) in textSplit" :key="`${idx}-${split.text}`">
    <span
      v-if="split.type === 'md'"
      v-html="renderMarkdown(split.text, entityStore.entityAttributes, true)"
    ></span>
    <RouterLink v-else-if="split.type === 'link'" :to="split.to">{{
      split.text
    }}</RouterLink>
  </span>
</template>

<script setup lang="ts">
import router, { WIKI_PATHS_SPECIFIC_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { stringToLinkID, renderMarkdown } from "@/utils/textUtils";
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{ line: string }>();
const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

const textSplit = computed(
  (): Array<
    | { type: "link"; text: string; to: RouteLocationRaw }
    | { type: "md"; text: string }
  > => {
    const split = props.line.split(
      /([A-Z][a-zA-Z ]+) \([A-Z][a-zA-z ]+\)|(Path of the [A-Z][a-z]+(?: [A-Z][a-z]+)*)/gm
    );
    return split.map((text) => {
      if (!text) {
        return { type: "md", text: "" };
      }
      if (
        text.startsWith("Path of the") &&
        jsonStorage.abilities.paths.some((path) => path.name === text)
      ) {
        return {
          type: "link",
          text,
          to: {
            name: WIKI_PATHS_SPECIFIC_ROUTE,
            params: { path: stringToLinkID(text) },
            query: router.currentRoute.value.query,
            hash: "#top",
          },
        };
      }
      const ability = jsonStorage.abilityMap[text];
      if (ability && ability.custom_fields?.path) {
        // return link info
        return {
          type: "link",
          text: `${ability.name} (${ability.custom_fields.path})`,
          to: {
            name: WIKI_PATHS_SPECIFIC_ROUTE,
            params: { path: stringToLinkID(ability.custom_fields.path) },
            query: router.currentRoute.value.query,
            hash: "#" + stringToLinkID(ability.name),
          },
        };
      }
      return { type: "md", text };
    });
  }
);
</script>
