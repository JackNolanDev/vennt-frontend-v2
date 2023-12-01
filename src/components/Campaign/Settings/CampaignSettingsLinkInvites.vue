<template>
  <div>
    <strong class="label-text">Links</strong>
    <div
      v-if="
        campaignStore.details?.invite_links &&
        campaignStore.details.invite_links.length > 0
      "
    >
      <div
        v-for="invitation in campaignStore.details.invite_links"
        :key="invitation.id"
        class="alignRow split"
      >
        <BaseCopyButton :text="invitationLink(invitation)" class="wide"
          >Copy Sharable Link (expires
          {{ formatExpires(invitation) }})</BaseCopyButton
        >
        <BaseButton
          icon="delete"
          title="Delete invitation"
          @click="campaignStore.adminDeleteInviteLink(invitation.id)"
        ></BaseButton>
      </div>
    </div>
    <p v-else class="ml-8 mr-8">No open invitation links</p>
    <CreateCampaignInvitationLinkButton></CreateCampaignInvitationLinkButton>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import BaseButton from "../../Base/BaseButton.vue";
import CreateCampaignInvitationLinkButton from "./CreateCampaignInvitationLinkButton.vue";
import BaseCopyButton from "@/components/Base/BaseCopyButton.vue";
import type { CampaignInviteLink } from "vennt-library";

const campaignStore = useCampaignStore();

const invitationLink = (invitation: CampaignInviteLink) =>
  `${window.location.origin}/invite/${invitation.hash}`;

const formatExpires = (invitation: CampaignInviteLink) => {
  const dayInMS = 1000 * 60 * 60 * 24;
  const invitationDate = new Date(invitation.expires);
  const dayDiffs =
    Math.floor(invitationDate.getTime() / dayInMS) -
    Math.floor(Date.now() / dayInMS);
  const rtf = new Intl.RelativeTimeFormat("en", {
    style: "short",
    numeric: "auto",
  });
  const todayString =
    dayDiffs === 0
      ? ` at ${invitationDate.toLocaleTimeString("en-US", {
          minute: "2-digit",
          hour: "2-digit",
        })}`
      : "";
  return rtf.format(dayDiffs, "day") + todayString;
};
</script>
