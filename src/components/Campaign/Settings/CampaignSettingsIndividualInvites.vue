<template>
  <div>
    <strong class="label-text">Individual Invitations</strong>
    <ul
      v-if="
        campaignStore.details?.invites &&
        campaignStore.details.invites.length > 0
      "
    >
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
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import SendCampaignInviteButton from "./SendCampaignInviteButton.vue";
import BaseButton from "../../Base/BaseButton.vue";

const campaignStore = useCampaignStore();
</script>
