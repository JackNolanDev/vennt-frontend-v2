<template>
  <BaseLayout class="nav">
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout>
      <h1>Admin controls</h1>
      <BaseDropDown title="Web scraper settings">
        <div>
          <BaseButton @click="scrapeWeaponTypes" class="wide"
            >Scrape Weapon Types</BaseButton
          >
          <BaseButton @click="scrapeItemShop" class="wide"
            >Scrape Item Shop</BaseButton
          >
          <BaseButton @click="scrapeAbilities" class="wide"
            >Scrape Abilities</BaseButton
          >
          <BaseButton @click="scrapeAbilitiesForwardCompatible" class="wide"
            >Scrape Abilities Forward Compatible</BaseButton
          >
          <div class="separator mt-16 mb-16"></div>
          <BaseButton @click="updateItemShopUses" class="wide"
            >Update Item Shop Uses</BaseButton
          >
          <BaseButton @click="updateAbilityUses" class="wide"
            >Update Ability Uses</BaseButton
          >
          <div class="separator mt-16 mb-16"></div>
          <BaseButton @click="testFetchWeapons" class="wide"
            >Fetch Weapon Types</BaseButton
          >
          <BaseButton @click="testFetchItems" class="wide"
            >Fetch Item Shop</BaseButton
          >
          <BaseButton @click="testFetchAbilities" class="wide"
            >Fetch Abilities</BaseButton
          >
          <div class="separator mt-16 mb-16"></div>
          <BaseButton @click="configureStorageBucket" class="wide"
            >Configure Storage CORS</BaseButton
          >
        </div>
      </BaseDropDown>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import {
  configureStorageBucketApi,
  triggerUpdateUses,
  triggerWebscraperApi,
} from "@/api/apiAdmin";
import {
  fetchAbilitiesApi,
  fetchShopItemsApi,
  fetchWeaponTypesApi,
} from "@/api/apiStorage";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseDropDown from "@/components/Base/BaseDropDown.vue";
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import {
  ABILITIES_KEY,
  ABILITIES_KEY_OLD,
  SHOP_ITEMS_KEY,
  WEAPON_TYPES_KEY,
} from "vennt-library";

const scrapeWeaponTypes = () => triggerWebscraperApi(WEAPON_TYPES_KEY);
const scrapeItemShop = () => triggerWebscraperApi(SHOP_ITEMS_KEY);
const scrapeAbilities = () => triggerWebscraperApi(ABILITIES_KEY);
const scrapeAbilitiesForwardCompatible = () =>
  triggerWebscraperApi(ABILITIES_KEY_OLD);
const updateItemShopUses = () => triggerUpdateUses(SHOP_ITEMS_KEY);
const updateAbilityUses = () => triggerUpdateUses(ABILITIES_KEY);
const configureStorageBucket = () => configureStorageBucketApi();
const testFetchWeapons = () => fetchWeaponTypesApi();
const testFetchItems = () => fetchShopItemsApi();
const testFetchAbilities = () => fetchAbilitiesApi();
</script>
