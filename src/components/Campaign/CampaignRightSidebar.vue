<template>
  <CampaignChat v-if="campaignStore.chat"></CampaignChat>
  <div v-else class="panel ml-16 mr-16">
    <div>Campaign loading</div>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import CampaignChat from "./CampaignChat.vue";

const campaignStore = useCampaignStore();
</script>
