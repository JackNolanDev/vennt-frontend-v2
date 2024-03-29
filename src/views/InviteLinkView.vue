<template>
  <BaseLayout class="nav">
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout>
      <div v-if="state.campaign">
        <h1>{{ state.campaign.name }}</h1>
        <p><strong>Campaign Description:</strong></p>
        <div v-html="renderMarkdown(state.campaign.desc)"></div>
        <BaseButton
          @click="joinCampaignButton"
          :disabled="state.disableJoinButton"
          icon="person_add"
          class="primary bolder wide"
          >Join Campaign?</BaseButton
        >
      </div>
      <div v-else-if="state.fetchFailed">
        <p class="label-text stronger">This link has expired or is invalid!</p>
        <BaseButton
          :to="{ name: HOME_ROUTE }"
          icon="home"
          class="primary wide bolder"
          >Head home</BaseButton
        >
      </div>
      <div v-else-if="accountInfoStore.isLoggedIn" class="alignRow center">
        <BaseSpinner class="mt-64"></BaseSpinner>
      </div>
      <div v-else>
        <p>Log in to view this campaign invite!</p>
        <BaseButton class="primary bold" icon="login">Log In</BaseButton>
      </div>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import router, { CAMPAIGN_ROUTE, HOME_ROUTE } from "@/router";
import { onBeforeMount, reactive } from "vue";
import { useRoute } from "vue-router";
import { campaignInviteLinkHashValidator, type Campaign } from "vennt-library";
import BaseNav from "@/components/Base/BaseNav.vue";
import { useAccountInfoStore } from "@/stores/accountInfo";
import {
  fetchCampaignByCampaignInviteLinkApi,
  joinCampaignUsingInviteLinkApi,
} from "@/api/apiCampaignInviteLinks";
import { renderMarkdown } from "@/utils/textUtils";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseSpinner from "@/components/Base/BaseSpinner.vue";
import { useCampaignStore } from "@/stores/campaign";

const accountInfoStore = useAccountInfoStore();
const campaignStore = useCampaignStore();
const route = useRoute();

const state = reactive<{
  campaign: Campaign | null;
  disableJoinButton: boolean;
  hash: string;
  fetchFailed: boolean;
}>({ campaign: null, disableJoinButton: false, hash: "", fetchFailed: false });

onBeforeMount(async () => {
  const hash = campaignInviteLinkHashValidator.safeParse(route.params.hash);
  if (!hash.success) {
    router.push({ name: HOME_ROUTE });
    return;
  }
  state.hash = hash.data;
  if (accountInfoStore.isLoggedIn) {
    try {
      state.campaign = await fetchCampaignByCampaignInviteLinkApi(state.hash);
    } catch (err) {
      state.fetchFailed = true;
      return;
    }

    try {
      await campaignStore.fetchCampaign(state.campaign.id, true);
      router.push({
        name: CAMPAIGN_ROUTE,
        params: { campaignId: state.campaign.id },
      });
    } catch (err) {
      // do nothing
    }
  }
});

const joinCampaignButton = async () => {
  state.disableJoinButton = true;
  const response = await joinCampaignUsingInviteLinkApi(state.hash);
  router.push({
    name: CAMPAIGN_ROUTE,
    params: { campaignId: response.campaign_id },
  });
};
</script>
