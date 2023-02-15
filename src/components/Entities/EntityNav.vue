<template>
  <nav class="nav alignRow split main-entity-nav">
    <div class="alignRow gap ml-8 desktop-only">
      <BaseButton
        :to="{ name: ENTITY_DESCRIPTION_ROUTE, params: { id: entity.id } }"
        title="Main & Flux (f)"
        icon="person"
        class="skinny"
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
        v-if="entityState.canEdit"
        :to="{ name: ENTITY_SETTINGS_ROUTE, params: { id: entity.id } }"
        title="Character Settings (h)"
        icon="settings"
        class="skinny"
      ></BaseButton>
    </div>
    <div class="alignRow gap mr-8">
      <BaseButton
        v-if="entityState.canEdit"
        @click="entityNotesStore.toggleNotes"
        title="Show Character notes (n)"
        icon="edit_note"
        class="skinny desktop-only"
      ></BaseButton>
      <BaseButton
        @click="toggleDropdown"
        icon="menu"
        class="skinny"
      ></BaseButton>
    </div>
  </nav>
  <div v-if="state.dropdownOpen" class="nav-dropdown" @click="toggleDropdown">
    <div class="separator"></div>
    <nav class="mt-8 mb-8 ml-8 mr-8">
      <div v-if="accountInfoStore.isLoggedIn">
        <BaseButton
          :to="{ name: ENTITY_STATS_ROUTE, params: { id: entity.id } }"
          title="Character stats"
          icon="bar_chart"
          class="skinny bold wide mobile-only"
          >Entity Stats</BaseButton
        >
        <BaseButton
          :to="{ name: ENTITY_DESCRIPTION_ROUTE, params: { id: entity.id } }"
          icon="person"
          class="skinny bold wide mobile-only"
          >Description</BaseButton
        >
        <BaseButton
          :to="{ name: ENTITY_ABILITIES_ROUTE, params: { id: entity.id } }"
          icon="hiking"
          class="skinny bold wide mobile-only"
          >Abilities</BaseButton
        >
        <BaseButton
          :to="{ name: ENTITY_ITEMS_ROUTE, params: { id: entity.id } }"
          icon="backpack"
          class="skinny bold wide mobile-only"
          >Inventory</BaseButton
        >
        <BaseButton
          :to="{ name: ENTITY_COMBAT_ROUTE, params: { id: entity.id } }"
          title="Combat (c)"
          icon="sports_kabaddi"
          class="skinny bold wide mobile-only"
          >Combat</BaseButton
        >
        <BaseButton
          :to="{ name: ENTITY_NOTES_ROUTE, params: { id: entity.id } }"
          title="Combat (c)"
          icon="edit_note"
          class="skinny bold wide mobile-only"
          >Notes</BaseButton
        >
        <BaseButton
          v-if="entityState.canEdit"
          :to="{ name: ENTITY_SETTINGS_ROUTE, params: { id: entity.id } }"
          title="Character Settings (h)"
          icon="settings"
          class="skinny bold wide mobile-only"
          >Settings</BaseButton
        >
        <div class="separator mt-8 mb-8 mobile-only"></div>
      </div>
      <BaseButton
        :to="{ name: HOME_ROUTE }"
        icon="home"
        class="skinny bold wide"
      >
        Home
      </BaseButton>
      <div v-if="!accountInfoStore.isLoggedIn">
        <BaseButton
          :to="{ name: LOGIN_ROUTE }"
          icon="login"
          class="skinny bold wide"
        >
          Login
        </BaseButton>
        <BaseButton
          :to="{ name: SIGNUP_ROUTE }"
          icon="person_add"
          class="skinny bold wide"
        >
          Signup
        </BaseButton>
      </div>
      <BaseButton
        v-else
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
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  ENTITY_DESCRIPTION_ROUTE,
  ENTITY_NOTES_ROUTE,
} from "@/router";
import { useAccountInfoStore } from "@/stores/accountInfo";
import { useEntityStore } from "@/stores/entity";
import { useEntityNotesStore } from "@/stores/entityNotes";
import type { FullEntity } from "@/utils/backendTypes";
import { reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const state = reactive({ dropdownOpen: false });
defineProps<{ entity: FullEntity }>();
const accountInfoStore = useAccountInfoStore();
const entityState = useEntityStore();
const entityNotesStore = useEntityNotesStore();

const toggleDropdown = () => {
  state.dropdownOpen = !state.dropdownOpen;
};
</script>

<style scoped>
.mobile-only {
  display: none;
}
@media screen and (max-width: 760px) {
  .mobile-only {
    display: flex;
  }
  .desktop-only {
    display: none;
  }
  .main-entity-nav {
    flex-direction: row-reverse;
  }
  .nav-dropdown {
    width: 100%;
  }
}
</style>
