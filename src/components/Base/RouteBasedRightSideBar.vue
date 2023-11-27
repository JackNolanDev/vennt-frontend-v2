<template>
  <BaseButton icon="close" :to="exitRoute">Close</BaseButton>
  <slot></slot>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "./BaseButton.vue";
import { ENTITY_ROUTE } from "@/router";
import { useRoute } from "vue-router";

const DEFAULT_ROUTE_KEY = "detail";

const props = defineProps<{
  routeKey?: string;
  queryParams?: string[];
  importantQueryParams?: string[];
}>();
const route = useRoute();

const exitRoute = computed(() => {
  const query = props.queryParams?.some((key) => route.query[key]);
  if (query) {
    const removeKey = Object.keys(route.query).find(
      (key) => props.queryParams?.includes(key),
    );
    if (removeKey) {
      const query = { ...route.query };
      delete query[removeKey];
      return {
        name: route.name ?? ENTITY_ROUTE,
        params: route.params,
        query,
      };
    }
  }
  const routeKey = props.routeKey ?? DEFAULT_ROUTE_KEY;
  if (route.params[routeKey]) {
    const params = { ...route.params };
    delete params[routeKey];
    return {
      name: route.name ?? ENTITY_ROUTE,
      params,
      query: route.query,
    };
  }
  const importantQuery = props.importantQueryParams?.some(
    (key) => route.query[key],
  );
  if (importantQuery) {
    const removeKey = Object.keys(route.query).find(
      (key) => props.importantQueryParams?.includes(key),
    );
    if (removeKey) {
      const query = { ...route.query };
      delete query[removeKey];
      return {
        name: route.name ?? ENTITY_ROUTE,
        params: route.params,
        query,
      };
    }
  }
  return {};
});
</script>
