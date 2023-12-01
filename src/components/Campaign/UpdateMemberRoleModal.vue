<template>
  <ConfirmationModal
    triggerClass="skinny"
    triggerTitle="Click to change this member's role in this campaign"
    :mainButtonDisabled="state.role === member.role"
    :id="`update-${member.id}-role`"
    @mainButton="updateRole"
  >
    <template #triggerButton
      ><span class="muted-text">({{ member.role }})</span></template
    >
    <template #title>Update Campaign Role</template>
    <template #mainButton>Update</template>
    <form>
      <label class="label-text"
        >Current role:
        <strong class="title-case">{{ member.role }}</strong></label
      >
      <div class="cols-2 center-items mt-4">
        <label for="update-role" class="labelText nowrap">New Role</label>
        <select v-model="state.role" id="update-role" class="input">
          <option v-for="role in CAMPAIGN_ROLES" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>
    </form>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import {
  CAMPAIGN_ROLES,
  type CampaignMember,
  type CampaignRole,
} from "vennt-library";
import ConfirmationModal from "../Base/ConfirmationModal.vue";
import { reactive } from "vue";
import { useCampaignStore } from "@/stores/campaign";

const props = defineProps<{ member: CampaignMember }>();
const state = reactive<{ role: CampaignRole }>({ role: "SPECTATOR" });
const campaignStore = useCampaignStore();

const updateRole = () => {
  campaignStore.adminUpdateCampaignMemberRole(
    props.member.account_id,
    state.role,
  );
};
</script>
