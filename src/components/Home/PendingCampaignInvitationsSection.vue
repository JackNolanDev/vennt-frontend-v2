<template>
  <div>
    <h3>Pending Campaign Invitations</h3>
    <div class="invitation-group">
      <div
        v-for="invitation in homeState.campaignInvitations"
        :key="invitation.id"
        class="card border column padded"
      >
        <h4 class="mt-0 mb-0">{{ invitation.name }}</h4>
        <div
          v-html="DOMPurify.sanitize(invitation.desc)"
          class="textBlock"
        ></div>
        <p class="mt-0 mb-0"><strong>From:</strong> {{ invitation.from }}</p>
        <p><strong>Role:</strong> {{ invitation.role }}</p>
        <div class="cols-2 gap">
          <BaseButton
            @click="homeState.acceptCampaignInvitation(invitation)"
            class="primary"
            >Accept</BaseButton
          >
          <BaseButton
            @click="homeState.declineCampaignInvite(invitation)"
            class="secondary"
            >Decline</BaseButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHomeState } from "@/stores/home";
import BaseButton from "../Base/BaseButton.vue";
import DOMPurify from "dompurify";

const homeState = useHomeState();
</script>

<style scoped>
.invitation-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr [col-start]);
  gap: 4px;
}

.singleCard {
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
}

@container page (max-width: 600px) {
  .invitation-group {
    grid-template-columns: repeat(1, 1fr [col-start]);
  }
}
</style>
