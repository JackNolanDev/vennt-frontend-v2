<template>
  <form class="combat-stats-panel ml-16 mr-16 mb-64">
    <div class="centeredText">
      <h2>Campaign Settings</h2>
    </div>
    <div class="separator mt-8 mb-8"></div>
    <BaseDropDown v-if="campaignStore.details?.invites" title="Pending Invites">
      <ul v-if="campaignStore.details.invites.length > 0">
        <li
          v-for="invitation in campaignStore.details.invites"
          :key="invitation.id"
        >
          <div class="alignRow split">
            <span>{{ invitation.to }} ({{ invitation.role }})</span>
            <BaseButton
              icon="delete"
              title="Delete invitation"
              @click="campaignStore.adminDeleteInvite(invitation.id)"
            ></BaseButton>
          </div>
        </li>
      </ul>
      <p v-else class="ml-8 mr-8">No pending invitations</p>
      <SendCampaignInviteButton></SendCampaignInviteButton>
    </BaseDropDown>
  </form>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import BaseDropDown from "../Base/BaseDropDown.vue";
import SendCampaignInviteButton from "./SendCampaignInviteButton.vue";
import BaseButton from "../Base/BaseButton.vue";

const campaignStore = useCampaignStore();
</script>
