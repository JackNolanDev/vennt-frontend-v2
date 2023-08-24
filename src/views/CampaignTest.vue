<template>
  <BaseLayout class="nav sidebar">
    <template #nav><BaseNav></BaseNav></template>
    <template #sidebar><CampaignMapBuilder></CampaignMapBuilder></template>
    <CampaignMap></CampaignMap>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import CampaignMap from "@/components/Campaign/CampaignMap.vue";
import CampaignMapBuilder from "@/components/Campaign/CampaignMapBuilder.vue";
</script>
