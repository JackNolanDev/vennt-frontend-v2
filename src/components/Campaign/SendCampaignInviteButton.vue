<template>
  <ConfirmationModal
    id="campaign-new-invitation"
    trigger-icon="person_add"
    trigger-class="primary wide"
    :main-button-disabled="sendButtonDisabled"
    @main-button="sendInvitation"
    @exit-modal="resetState"
    ><template #triggerButton>Send new invite</template>
    <template #title>Send New Invitation</template>
    <template #mainButton>Send</template>
    <form>
      <div class="cols-2 center-items">
        <label for="invitation-user" class="labelText">User</label>
        <input
          type="text"
          v-model.number="state.toUser"
          placeholder="Username of invitee"
          title="User to send the invitation to"
          id="invitation-user"
          class="input"
        />
      </div>
      <div class="cols-2 center-items mt-4">
        <label for="invitation-role" class="labelText nowrap"
          >Role in Campaign</label
        >
        <select v-model="state.role" id="invitation-role" class="input">
          <option v-for="role in CAMPAIGN_ROLES" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>
    </form>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import ConfirmationModal from "../Base/ConfirmationModal.vue";
import { computed, reactive } from "vue";
import { type CampaignRole, CAMPAIGN_ROLES } from "vennt-library";

const state = reactive<{ toUser: string; role: CampaignRole }>({
  toUser: "",
  role: "SPECTATOR",
});
const campaignStore = useCampaignStore();

const sendButtonDisabled = computed(
  () =>
    state.toUser === "" ||
    campaignStore.details?.invites?.some(
      (invitation) => invitation.to === state.toUser
    ) ||
    campaignStore.details?.members.some(
      (member) => member.username === state.toUser
    )
);

const sendInvitation = () => {
  campaignStore.adminSendInvite({ to: state.toUser, role: state.role });
  resetState();
};

const resetState = () => {
  state.toUser = "";
  state.role = "SPECTATOR";
};
</script>
