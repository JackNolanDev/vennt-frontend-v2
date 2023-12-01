<template>
  <h1>{{ campaignStore.details?.campaign.name }}</h1>
  <BaseStealthTextEditor
    v-model="state.desc"
    placeholder="Campaign Description"
    :save-button="true"
    :display-only="campaignStore.role !== 'GM'"
    @save="saveCampaignDesc"
    @cancel="cancelCampaignDesc"
  ></BaseStealthTextEditor>
  <div class="separator"></div>
  <div class="alignRow split">
    <h2>Members</h2>
    <BaseButton
      v-if="campaignStore.role !== 'SPECTATOR'"
      :to="{ name: CAMPAIGN_SETTINGS_ROUTE }"
      icon="settings"
      ><span
        ><span v-if="campaignStore.role === 'GM'" class="remove-when-small"
          >Send Invitations /</span
        >
        Settings</span
      ></BaseButton
    >
  </div>
  <table>
    <tr>
      <th>Members</th>
      <th>Characters</th>
    </tr>
    <tr v-for="member in campaignStore.details?.members" :key="member.id">
      <td>
        <div class="alignRow gap">
          <strong>{{ member.username }}</strong>
          <UpdateMemberRoleModal
            v-if="campaignStore.role === 'GM'"
            :member="member"
          ></UpdateMemberRoleModal>
          <span v-else class="muted-text">({{ member.role }})</span>
        </div>
      </td>
      <td v-if="entitiesForAccount(member.account_id).length > 0">
        <div
          v-for="entity in entitiesForAccount(member.account_id)"
          :key="entity.entity_id"
          class="alignRow"
        >
          <BaseButton
            :to="{
              name: ENTITY_ROUTE,
              params: { id: entity.entity_id },
              query: { campaign: campaignStore.details?.campaign.id },
            }"
            class="wide"
            ><template #customIcon>
              <BulletPoint :entity="entity"></BulletPoint></template
            >{{
              `${entity.name} ${entity.gm_only ? " (Hidden)" : ""}`
            }}</BaseButton
          >
          <RemoveCampaignEntityButton
            v-if="
              campaignStore.role === CAMPAIGN_ROLE_GM ||
              (accountInfoStore.accountInfo &&
                entity.owner === accountInfoStore.accountInfo.id)
            "
            :entity="entity"
          ></RemoveCampaignEntityButton>
        </div>
      </td>
      <td v-else>(No entities added)</td>
    </tr>
  </table>
  <AddEntityToCampaignButton></AddEntityToCampaignButton>
</template>

<script setup lang="ts">
import { CAMPAIGN_SETTINGS_ROUTE, ENTITY_ROUTE } from "@/router";
import { useCampaignStore } from "@/stores/campaign";
import { type CampaignEntity, CAMPAIGN_ROLE_GM } from "vennt-library";
import { reactive } from "vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import AddEntityToCampaignButton from "@/components/Campaign/AddEntityToCampaignButton.vue";
import BulletPoint from "@/components/Base/BulletPoint.vue";
import BaseStealthTextEditor from "@/components/Base/BaseStealthTextEditor.vue";
import RemoveCampaignEntityButton from "./RemoveCampaignEntityButton.vue";
import { useAccountInfoStore } from "@/stores/accountInfo";
import UpdateMemberRoleModal from "./UpdateMemberRoleModal.vue";

const accountInfoStore = useAccountInfoStore();
const campaignStore = useCampaignStore();
const defaultState = { desc: campaignStore.details?.campaign.desc ?? "" };
const state = reactive({ ...defaultState });

const entitiesForAccount = (accountId: string): CampaignEntity[] =>
  campaignStore.details?.entities.filter(
    (entity) => entity.owner === accountId,
  ) ?? [];
const saveCampaignDesc = () => {
  campaignStore.putCampaignDesc({ desc: state.desc });
};
const cancelCampaignDesc = () => {
  state.desc = campaignStore.details?.campaign.desc ?? "";
};
</script>

<style scoped>
@container page (max-width: 400px) {
  .remove-when-small {
    display: none;
  }
}
</style>
