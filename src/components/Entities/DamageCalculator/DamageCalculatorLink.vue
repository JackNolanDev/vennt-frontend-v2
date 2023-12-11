<template>
  <BaseButton
    :to="{
      name: fallbackEntitySidebarPage($route.name, ENTITY_COMBAT_ROUTE),
      params: { ...$route.params, detail: 'damage' },
      query: $route.query,
    }"
    icon="calculate"
    class="wide"
    >Damage Calculator</BaseButton
  >
</template>

<script setup lang="ts">
import BaseButton from "../../Base/BaseButton.vue";
import { ENTITY_COMBAT_ROUTE } from "@/router";
import { fallbackEntitySidebarPage } from "@/utils/routerUtils";
</script>
