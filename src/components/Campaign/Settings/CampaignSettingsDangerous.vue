<template>
  <BaseDropDown title="Dangerous Settings">
    <div class="m-8">
      <ConfirmationModal
        id="leave-campaign-modal"
        trigger-icon="person_remove"
        trigger-class="wide"
        :main-button-disabled="!allowedToLeave"
        @main-button="leaveCampaign"
      >
        <template #triggerButton>Leave Campaign</template>
        <template #title>Leave Campaign</template>
        <template #mainButton>Leave</template>
        <div v-if="allowedToLeave">
          Are you sure you want to leave "{{
            campaignStore.details?.campaign.name
          }}"? If you want to rejoin in the future, you will need to be
          re-invited.
        </div>
        <div v-else>
          You are not allowed to leave this campaign as the only GM. Please
          elect another member as a GM before you may leave
        </div>
      </ConfirmationModal>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import BaseDropDown from "../../Base/BaseDropDown.vue";
import ConfirmationModal from "@/components/Base/ConfirmationModal.vue";
import { removeCampaignMemberApi } from "@/api/apiCampaigns";
import { useAccountInfoStore } from "@/stores/accountInfo";
import router, { HOME_ROUTE } from "@/router";
import { computed } from "vue";

const accountInfoStore = useAccountInfoStore();
const campaignStore = useCampaignStore();

const allowedToLeave = computed(() => {
  if (campaignStore.role === "GM" && campaignStore.details) {
    return (
      campaignStore.details.members.filter((member) => member.role === "GM")
        .length > 1
    );
  }
  return true;
});

const leaveCampaign = async () => {
  if (!campaignStore.details || !accountInfoStore.accountInfo) return;
  await removeCampaignMemberApi(
    campaignStore.details.campaign.id,
    accountInfoStore.accountInfo.id,
  );
  campaignStore.reset();
  router.push({ name: HOME_ROUTE });
};
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
