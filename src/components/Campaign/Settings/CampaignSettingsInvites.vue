<template>
  <BaseDropDown v-if="campaignStore.role === 'GM'" title="Campaign Invitations">
    <div class="m-8 cols-2 gap table-split">
      <CampaignSettingsLinkInvites
        class="link-invites-side"
      ></CampaignSettingsLinkInvites>
      <CampaignSettingsIndividualInvites></CampaignSettingsIndividualInvites>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import BaseDropDown from "../../Base/BaseDropDown.vue";
import CampaignSettingsLinkInvites from "./CampaignSettingsLinkInvites.vue";
import CampaignSettingsIndividualInvites from "./CampaignSettingsIndividualInvites.vue";

const campaignStore = useCampaignStore();
</script>

<style scoped>
/* Mobile Styles */
@media screen and (max-width: 600px) {
  .table-split {
    grid-template-columns: 1fr;
  }
  .link-invites-side {
    border-bottom: 2px solid var(--border);
    padding-bottom: 16px;
  }
}
</style>
