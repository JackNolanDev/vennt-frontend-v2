<template>
  <BaseLayout class="nav sidebar-right prefers-main">
    <template #nav><BaseNav></BaseNav></template>
    <template #sidebar-right
      ><CampaignRightSidebar></CampaignRightSidebar
    ></template>
    <PageLayout>
      <div v-if="campaignStore.details">
        <CampaignLandingPage></CampaignLandingPage>
      </div>
      <div v-else>
        <p>Campaign Loading</p>
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
import { idValidator } from "vennt-library";
import { onBeforeMount } from "vue";
import CampaignLandingPage from "@/components/Campaign/CampaignLandingPage.vue";
import CampaignRightSidebar from "@/components/Campaign/CampaignRightSidebar.vue";

const campaignStore = useCampaignStore();

onBeforeMount(() => {
  const id = idValidator.safeParse(router.currentRoute.value.params.campaignId);
  if (!id.success) {
    router.push({ name: HOME_ROUTE });
    return;
  }
  campaignStore.fetchCampaign(id.data, true);
  campaignStore.connectToWebsocket(id.data);
});
</script>
