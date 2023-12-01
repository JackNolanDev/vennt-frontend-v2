<template>
  <ConfirmationModal
    id="campaign-new-invitation"
    trigger-icon="share"
    trigger-class="primary wide"
    @main-button="createButton"
    @exit-modal="resetState"
    ><template #triggerButton>Create new link</template>
    <template #title>Create New Link</template>
    <template #mainButton>Create</template>
    <form>
      <p>
        Once created, anyone can use this link to join this campaign as a
        <strong>"Spectator"</strong> until it expires. You can then change their
        role to <strong>"Player"</strong> or <strong>"GM"</strong>.
      </p>
      <div class="cols-2 center-items">
        <label for="invitation-link-expires" class="labelText"
          >Expires in</label
        >
        <select
          v-model="state.expires"
          id="invitation-link-expires"
          class="input"
        >
          <option
            v-for="(mins, label) in expiresOptions"
            :key="label"
            :value="mins"
          >
            {{ label }}
          </option>
        </select>
      </div>
    </form>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import ConfirmationModal from "../../Base/ConfirmationModal.vue";
import { reactive } from "vue";

const expiresOptions = {
  "30 minutes": 30,
  "1 hour": 60,
  "24 hours": 60 * 24,
  "7 days": 60 * 24 * 7,
};

const state = reactive<{ expires: number }>({
  expires: 30,
});

const campaignStore = useCampaignStore();

const createButton = () => {
  campaignStore.adminCreateInviteLink(state.expires);
  resetState();
};

const resetState = () => {
  state.expires = 30;
};
</script>
