<template>
  <nav class="nav alignRow split main-entity-nav">
    <div class="alignRow gap ml-8 desktop-only">
      <BaseButton
        :to="{ name: ENTITY_DESCRIPTION_ROUTE, query }"
        title="Main & Flux (f)"
        icon="person"
        class="skinny"
      ></BaseButton>
      <BaseButton
        :to="{ name: ENTITY_ABILITIES_ROUTE, query }"
        title="Abilities (a)"
        icon="hiking"
        class="skinny"
      ></BaseButton>
      <BaseButton
        :to="{ name: ENTITY_ITEMS_ROUTE, query }"
        title="Inventory (i)"
        icon="backpack"
        class="skinny"
      ></BaseButton>
      <BaseButton
        :to="{ name: ENTITY_COMBAT_ROUTE, query }"
        title="Combat (c)"
        icon="sports_kabaddi"
        class="skinny"
      ></BaseButton>
      <BaseButton
        v-if="entityStore.canEdit"
        :to="{ name: ENTITY_SETTINGS_ROUTE, query }"
        title="Character Settings (h)"
        icon="settings"
        class="skinny"
      ></BaseButton>
      <div v-if="!entityStore.canEdit">(Non-editor view)</div>
      <div v-else-if="campaignStore.role === 'GM'">(GM view)</div>
    </div>
    <div class="mobile-only ml-8 mobile-header-text">
      <span v-if="entityStore.inCombat"
        >Actions:
        <span class="number">{{
          entityStore.computedAttributes.actions?.val
        }}</span>
        / Reactions:
        <span class="number">{{
          entityStore.computedAttributes.reactions?.val
        }}</span></span
      >
      <span v-else class="nowrap hide-extra ellipsis">{{
        entityStore.entity?.entity.name
      }}</span>
    </div>
    <div class="alignRow gap mr-8">
      <BaseButton
        v-if="entityStore.canEdit"
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
      <div>
        <BaseButton
          :to="{ name: ENTITY_STATS_ROUTE, query }"
          title="Character stats"
          icon="bar_chart"
          class="skinny bold wide mobile-only"
          >Entity Stats</BaseButton
        >
        <BaseButton
          :to="{ name: ENTITY_DESCRIPTION_ROUTE, query }"
          icon="person"
          class="skinny bold wide mobile-only"
          >Description</BaseButton
        >
        <BaseButton
          :to="{ name: ENTITY_ABILITIES_ROUTE, query }"
          icon="hiking"
          class="skinny bold wide mobile-only"
          >Abilities</BaseButton
        >
        <BaseButton
          :to="{ name: ENTITY_ITEMS_ROUTE, query }"
          icon="backpack"
          class="skinny bold wide mobile-only"
          >Inventory</BaseButton
        >
        <BaseButton
          :to="{ name: ENTITY_COMBAT_ROUTE, query }"
          icon="sports_kabaddi"
          class="skinny bold wide mobile-only"
          >Combat</BaseButton
        >
        <BaseButton
          v-if="entityStore.canEdit"
          :to="{ name: ENTITY_NOTES_ROUTE, query }"
          icon="edit_note"
          class="skinny bold wide mobile-only"
          >Notes</BaseButton
        >
        <BaseButton
          v-if="entityStore.canEdit"
          :to="{ name: ENTITY_SETTINGS_ROUTE, query }"
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
          Log in
        </BaseButton>
        <BaseButton
          :to="{ name: SIGNUP_ROUTE }"
          icon="person_add"
          class="skinny bold wide"
        >
          Sign up
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
      <BaseButton
        v-if="campaignStore.details"
        :to="{
          name: CAMPAIGN_ROUTE,
          params: { campaignId: campaignStore.details.campaign.id },
        }"
        icon="group"
        class="skinny bold wide"
      >
        Return to Campaign
      </BaseButton>
    </nav>
  </div>
</template>

<script setup lang="ts">
import router, {
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
  CAMPAIGN_ROUTE,
} from "@/router";
import { useAccountInfoStore } from "@/stores/accountInfo";
import { useEntityStore } from "@/stores/entity";
import { useEntityNotesStore } from "@/stores/entityNotes";
import { computed, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import { useCampaignStore } from "@/stores/campaign";

const state = reactive({ dropdownOpen: false });
const accountInfoStore = useAccountInfoStore();
const campaignStore = useCampaignStore();
const entityStore = useEntityStore();
const entityNotesStore = useEntityNotesStore();

const query = computed(() => router.currentRoute.value.query);

const toggleDropdown = () => {
  state.dropdownOpen = !state.dropdownOpen;
};
</script>

<style scoped>
.mobile-only {
  display: none;
}
.mobile-header-text {
  max-width: calc(100vw - 38px - 16px);
}
@media screen and (max-width: 760px) {
  .mobile-only {
    display: flex;
  }
  .desktop-only {
    display: none;
  }
  .nav-dropdown {
    width: 100%;
  }
}
</style>
