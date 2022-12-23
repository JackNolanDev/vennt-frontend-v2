<template>
  <BaseLayout>
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout>
      <h1>Admin controls</h1>
      <BaseDropDown>
        <template #closedTitle>web scraper settings</template>
        <template #openTitle>web scraper settings</template>
        <div>
          <BaseButton @click="scrapeWeaponTypes" class="wide"
            >Scrape Weapon Types</BaseButton
          >
          <BaseButton @click="scrapeItemShop" class="wide"
            >Scrape Item Shop</BaseButton
          >
          <BaseButton class="wide">Scrape Abilities</BaseButton>
          <div class="seperator mt-16 mb-16"></div>
          <BaseButton @click="testFetchWeapons" class="wide"
            >Fetch Weapon Types</BaseButton
          >
          <BaseButton @click="testFetchItems" class="wide"
            >Fetch Item Shop</BaseButton
          >
        </div>
      </BaseDropDown>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import { triggerWebscraperApi } from "@/api/apiAdmin";
import { fetchShopItemsApi, fetchWeaponTypesApi } from "@/api/apiStorage";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseDropDown from "@/components/Base/BaseDropDown.vue";
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import BaseNav from "@/components/Nav/BaseNav.vue";
import { SHOP_ITEMS_KEY, WEAPON_TYPES_KEY } from "@/utils/backendTypes";

const scrapeWeaponTypes = () => triggerWebscraperApi(WEAPON_TYPES_KEY);
const scrapeItemShop = () => triggerWebscraperApi(SHOP_ITEMS_KEY);
const testFetchWeapons = () => fetchWeaponTypesApi();
const testFetchItems = () => fetchShopItemsApi();
</script>
