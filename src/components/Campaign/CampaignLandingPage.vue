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
  <h2>Members</h2>
  <table>
    <tr>
      <th>Members</th>
      <th>Characters</th>
    </tr>
    <tr v-for="member in campaignStore.details?.members" :key="member.id">
      <td>
        <strong>{{ member.username }}</strong> ({{ member.role }})
      </td>
      <td v-if="entitiesForAccount(member.account_id).length > 0">
        <BaseButton
          v-for="entity in entitiesForAccount(member.account_id)"
          :key="entity.entity_id"
          :to="{
            name: ENTITY_ROUTE,
            params: { id: entity.entity_id },
            query: { campaign: campaignStore.details?.campaign.id },
          }"
          class="wide"
          ><template #customIcon>
            <BulletPoint :entity="entity"></BulletPoint> </template
          >{{ entity.name }}</BaseButton
        >
      </td>
      <td v-else>(No entities added)</td>
    </tr>
  </table>
  <AddEntityToCampaignButton></AddEntityToCampaignButton>
</template>

<script setup lang="ts">
import router, { ENTITY_ROUTE, HOME_ROUTE } from "@/router";
import { useCampaignStore } from "@/stores/campaign";
import { idValidator, type CampaignEntity } from "@/utils/backendTypes";
import { onBeforeMount, reactive } from "vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import AddEntityToCampaignButton from "@/components/Campaign/AddEntityToCampaignButton.vue";
import BulletPoint from "@/components/Base/BulletPoint.vue";
import BaseStealthTextEditor from "@/components/Base/BaseStealthTextEditor.vue";

const campaignStore = useCampaignStore();
const defaultState = { desc: campaignStore.details?.campaign.desc ?? "" };
const state = reactive({ ...defaultState });

onBeforeMount(() => {
  const id = idValidator.safeParse(router.currentRoute.value.params.id);
  if (!id.success) {
    router.push({ name: HOME_ROUTE });
    return;
  }
  if (!campaignStore.details || campaignStore.details.campaign.id !== id.data) {
    campaignStore.fetchCampaign(id.data);
  }
});

const entitiesForAccount = (accountId: string): CampaignEntity[] =>
  campaignStore.details?.entities.filter(
    (entity) => entity.owner === accountId
  ) ?? [];
const saveCampaignDesc = () => {
  campaignStore.putCampaignDesc({ desc: state.desc });
};
const cancelCampaignDesc = () => {
  state.desc = campaignStore.details?.campaign.desc ?? "";
};
</script>
