<template>
  <nav class="nav alignRow split">
    <div class="alignRow gap ml-8">
      <BaseButton
        :to="{ name: ENTITY_STATS_ROUTE, params: { id: entity.id } }"
        title="Character stats"
        icon="bar_chart"
        class="skinny stats-link"
      ></BaseButton>
      <BaseButton
        :to="{ name: ENTITY_ABILITIES_ROUTE, params: { id: entity.id } }"
        title="Abilities (a)"
        icon="hiking"
        class="skinny"
      ></BaseButton>
      <BaseButton
        :to="{ name: ENTITY_ITEMS_ROUTE, params: { id: entity.id } }"
        title="Inventory (i)"
        icon="backpack"
        class="skinny"
      ></BaseButton>
      <BaseButton
        :to="{ name: ENTITY_COMBAT_ROUTE, params: { id: entity.id } }"
        title="Combat (c)"
        icon="sports_kabaddi"
        class="skinny"
      ></BaseButton>
      <BaseButton
        :to="{ name: ENTITY_SETTINGS_ROUTE, params: { id: entity.id } }"
        title="Character Settings (h)"
        icon="settings"
        class="skinny"
      ></BaseButton>
    </div>
    <div class="alignRow gap mr-8">
      <BaseButton
        @click="entityState.toggleNotes"
        title="Show Character notes (n)"
        icon="edit_note"
        class="skinny"
      ></BaseButton>
      <BaseButton
        @click="toggleDropdown"
        icon="menu"
        class="skinny"
      ></BaseButton>
    </div>
  </nav>
  <div v-if="state.dropdownOpen" class="nav-dropdown">
    <div class="seperator"></div>
    <nav class="mt-8 mb-8 ml-8 mr-8">
      <BaseButton
        :to="{ name: HOME_ROUTE }"
        icon="home"
        class="skinny bold wide"
      >
        Home
      </BaseButton>
      <BaseButton
        @click="accountInfoStore.postLogOut()"
        icon="logout"
        class="skinny bold wide"
      >
        Log out
      </BaseButton>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {
  ENTITY_ABILITIES_ROUTE,
  ENTITY_COMBAT_ROUTE,
  ENTITY_ITEMS_ROUTE,
  ENTITY_STATS_ROUTE,
  ENTITY_SETTINGS_ROUTE,
  HOME_ROUTE,
} from "@/router";
import { useAccountInfoStore } from "@/stores/accountInfo";
import { useEntityStore } from "@/stores/entity";
import type { FullEntity } from "@/utils/backendTypes";
import { reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const state = reactive({ dropdownOpen: false });
defineProps<{ entity: FullEntity }>();
const accountInfoStore = useAccountInfoStore();
const entityState = useEntityStore();

const toggleDropdown = () => {
  state.dropdownOpen = !state.dropdownOpen;
};
</script>

<style scoped>
.stats-link {
  display: none;
}
@media screen and (max-width: 760px) {
  .stats-link {
    display: flex;
  }
  .nav-dropdown {
    width: 100%;
  }
}
</style>
