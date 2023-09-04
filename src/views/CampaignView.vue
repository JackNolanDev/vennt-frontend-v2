<template>
  <BaseLayout class="nav" :class="{ sidebar: campaignStore.role === 'GM' }">
    <template #nav><BaseNav></BaseNav></template>
    <template #sidebar><CampaignGMSettings></CampaignGMSettings></template>
    <PageLayout>
      <div v-if="campaignStore.details">
        <CampaignLandingPage></CampaignLandingPage>
      </div>
      <div v-else>
        <p>Campaign Loading</p>
      </div>
      <div v-if="debug" class="mt-64">
        <pre><code>{{ campaignStore.details }}</code></pre>
      </div>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import router, { HOME_ROUTE } from "@/router";
import { useCampaignStore } from "@/stores/campaign";
import { idValidator } from "@/utils/backendTypes";
import { onBeforeMount } from "vue";
import CampaignGMSettings from "@/components/Campaign/CampaignGMSettings.vue";
import CampaignLandingPage from "@/components/Campaign/CampaignLandingPage.vue";

const campaignStore = useCampaignStore();

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

const debug = process.env.NODE_ENV === "development";
</script>
