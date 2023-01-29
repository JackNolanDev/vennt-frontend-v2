<template>
  <div class="entity-left-sidebar">
    <div class="top">
      <CombatStats
        v-if="entityStore.entity"
        :entity="entityStore.entity"
        :entity-attrs="entityStore.entityAttributes"
        :use-copyable-dice="true"
        :show-items="showItems"
      ></CombatStats>
    </div>
    <div class="bottom" v-if="showNotes">
      <EntityNotes></EntityNotes>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import CombatStats from "../CombatStats/CombatStats.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ENTITY_ITEM_SHOP_ROUTE } from "@/router";
import EntityNotes from "./EntityNotes.vue";

const entityStore = useEntityStore();
const route = useRoute();

const showItems = computed(() => route.name === ENTITY_ITEM_SHOP_ROUTE);
const showNotes = computed(
  () => entityStore.showNotes && typeof entityStore.notes === "string"
);
</script>

<style scoped>
.entity-left-sidebar {
  display: grid;
  height: var(--page-height);
}
.top {
  overflow-y: scroll;
}
</style>
