<template>
  <div v-if="show">
    <BaseButton icon="close" :to="exitRoute">Close</BaseButton>
    <div class="panel ml-16 mr-16 mb-64">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "./BaseButton.vue";
import router, { ENTITY_ROUTE } from "@/router";

const DEFAULT_ROUTE_KEY = "detail";

const props = defineProps<{ routeKey?: string }>();

const show = computed(
  () => router.currentRoute.value.params[props.routeKey ?? DEFAULT_ROUTE_KEY]
);
const exitRoute = computed(() => {
  const params = { ...router.currentRoute.value.params };
  delete params[props.routeKey ?? DEFAULT_ROUTE_KEY];
  return {
    name: router.currentRoute.value.name ?? ENTITY_ROUTE,
    params,
    query: router.currentRoute.value.query,
  };
});
</script>

<style scoped>
/* Mobile Styles */
@media screen and (max-width: 396px) {
  .panel {
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>
