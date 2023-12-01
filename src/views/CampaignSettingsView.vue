<template>
  <BaseLayout class="nav">
    <template #nav><CampaignSettingsNav></CampaignSettingsNav></template>
    <PageLayout>
      <h1>Campaign Settings</h1>
      <CampaignSettingsInvites></CampaignSettingsInvites>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import router, { HOME_ROUTE } from "@/router";
import { useCampaignStore } from "@/stores/campaign";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { idValidator } from "vennt-library";
import CampaignSettingsNav from "@/components/Campaign/CampaignSettingsNav.vue";
import CampaignSettingsInvites from "@/components/Campaign/Settings/CampaignSettingsInvites.vue";

const campaignStore = useCampaignStore();
const route = useRoute();

onBeforeMount(() => {
  const id = idValidator.safeParse(route.params.campaignId);
  if (!id.success) {
    router.push({ name: HOME_ROUTE });
    return;
  }
  campaignStore.fetchCampaign(id.data, true);
});
</script>
