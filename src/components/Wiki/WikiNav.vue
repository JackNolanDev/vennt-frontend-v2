<template>
  <nav class="nav alignRow split">
    <div class="alignRow gap nav-left">
      <RouterLink :to="{ name: HOME_ROUTE }" class="navButton navLogo notMobile"
        >VENNT</RouterLink
      >
      <div class="wide">
        <input
          placeholder="Search Wiki"
          v-model="state.search"
          @keyup="typingInSearch"
          type="text"
          inputmode="search"
          id="ability-search"
          class="input nav-search"
        />
        <div
          class="search-results"
          v-if="state.searchResultsOpen && !state.dropdownOpen"
        >
          <div class="separator"></div>
          <div class="mt-8 mb-8 ml-8 mr-8">
            <p class="muted-text pt-12 mt-0 mb-0">Search suggestions:</p>
            <div>
              <BaseButton
                v-for="result in searchResults"
                :key="result.text"
                :to="result.to"
                @click="clickSearchResult"
                class="wide hide-extra"
                >{{ result.text }}</BaseButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!accountInfoStore.isLoggedIn"
      class="alignRow gap mr-8 notMobile"
    >
      <BaseButton :to="{ name: LOGIN_ROUTE }" class="skinny bold">
        LOG IN
      </BaseButton>
      <BaseButton :to="{ name: SIGNUP_ROUTE }" class="skinny bold">
        SIGN UP
      </BaseButton>
    </div>
    <div v-else class="alignRow gap mr-8 notMobile">
      <div>
        <BaseButton @click="accountInfoStore.postLogOut()" class="skinny bold">
          LOGOUT
        </BaseButton>
      </div>
    </div>
    <BaseButton
      @click="toggleDropdown"
      icon="menu"
      class="skinny mobileOnly"
    ></BaseButton>
  </nav>
  <div v-if="state.dropdownOpen" class="nav-dropdown">
    <div class="separator"></div>
    <nav class="mt-8 mb-8 ml-8 mr-8">
      <BaseButton :to="{ name: HOME_ROUTE }" icon="home" class="skinny bold">
        HOME
      </BaseButton>
      <BaseButton
        :to="{
          name: WIKI_PATHS_ROUTE,
          query: $router.currentRoute.value.query,
        }"
        icon="arrow_back"
        class="skinny bold"
      >
        Back to Paths
      </BaseButton>
      <div v-if="!accountInfoStore.isLoggedIn">
        <BaseButton
          :to="{ name: LOGIN_ROUTE }"
          icon="login"
          class="skinny bold"
        >
          LOG IN
        </BaseButton>
        <BaseButton
          :to="{ name: SIGNUP_ROUTE }"
          icon="person_add"
          class="skinny bold"
        >
          SIGN UP
        </BaseButton>
      </div>
      <BaseButton
        v-else-if="entityStore.entity"
        :to="{
          name: ENTITY_ABILITIES_ROUTE,
          params: { id: entityStore.entity.entity.id },
        }"
        icon="person"
        class="skinny bold"
      >
        {{ entityStore.entity.entity.name }}
      </BaseButton>
    </nav>
  </div>
</template>

<script setup lang="ts">
import router, {
  ENTITY_ABILITIES_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  WIKI_PATHS_ROUTE,
  WIKI_PATHS_SPECIFIC_ROUTE,
} from "@/router";
import { useAccountInfoStore } from "@/stores/accountInfo";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { stringToLinkID } from "@/utils/textUtils";
import { computed, reactive } from "vue";
import { RouterLink, type RouteLocationRaw } from "vue-router";
import BaseButton from "../Base/BaseButton.vue";

const state = reactive({
  dropdownOpen: false,
  searchResultsOpen: false,
  search: "",
});
const accountInfoStore = useAccountInfoStore();
const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

const toggleDropdown = () => {
  state.dropdownOpen = !state.dropdownOpen;
};

interface SearchResult {
  text: string;
  to: RouteLocationRaw;
}
const searchResults = computed((): SearchResult[] => {
  if (!state.search) {
    return [];
  }
  const lowerCaseSearch = state.search.toLowerCase();
  const results: SearchResult[] = jsonStorage.abilities.paths
    .filter((path) => path.name.toLowerCase().includes(lowerCaseSearch))
    .map(({ name }) => ({
      text: name,
      to: {
        name: WIKI_PATHS_SPECIFIC_ROUTE,
        params: { path: stringToLinkID(name) },
        query: router.currentRoute.value.query,
        hash: "#top",
      },
    }));
  results.push(
    ...jsonStorage.abilities.abilities
      .filter(
        (ability) =>
          ability.name.toLowerCase().includes(lowerCaseSearch) &&
          ability.custom_fields?.path,
      )
      .map((ability) => ({
        text: ability.name,
        to: {
          name: WIKI_PATHS_SPECIFIC_ROUTE,
          params: { path: stringToLinkID(ability.custom_fields!.path!) },
          query: router.currentRoute.value.query,
          hash: "#" + stringToLinkID(ability.name),
        },
      })),
  );
  return results.slice(0, 15);
});

const typingInSearch = () => {
  state.searchResultsOpen = state.search.length !== 0;
};

const clickSearchResult = () => {
  state.searchResultsOpen = false;
};
</script>

<style scoped>
.nav-left {
  width: 600px;
}
.nav-search {
  height: calc(var(--nav-height) - 4px);
}
.search-results {
  position: absolute;
  left: 0;
  background-color: var(--sub-nav-background);
  width: 600px;
  z-index: 9;
}

/* Mobile Styles */
.mobileOnly {
  display: none;
}
.mobileLogo {
  display: none;
}

@media screen and (max-width: 600px) {
  .notMobile {
    display: none;
  }
  .mobileOnly {
    display: flex;
  }

  .nav-dropdown,
  .search-results {
    width: 100%;
  }
}
</style>
