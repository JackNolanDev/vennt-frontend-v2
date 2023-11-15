<template>
  <div class="panel ml-16 mr-16 mb-64">
    <CampaignChat v-if="campaignStore.chat"></CampaignChat>
    <div v-else>Campaign loading</div>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import CampaignChat from "./CampaignChat.vue";

const campaignStore = useCampaignStore();
</script>
