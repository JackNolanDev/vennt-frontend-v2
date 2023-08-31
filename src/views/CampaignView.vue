<template>
  <BaseLayout class="nav" :class="{ sidebar: campaignStore.role === 'GM' }">
    <template #nav><BaseNav></BaseNav></template>
    <template #sidebar><CampaignGMSettings></CampaignGMSettings></template>
    <PageLayout>
      <div v-if="campaignStore.details">
        <h1>{{ campaignStore.details.campaign.name }}</h1>
        <!-- TODO: Replace with BaseStealthTextEditor -->
        <div v-html="descHTML" class="textBlock"></div>
        <div class="separator"></div>
        <h2>Members</h2>
        <table>
          <tr>
            <th>Members</th>
            <th>Characters</th>
          </tr>
          <tr v-for="member in campaignStore.details.members" :key="member.id">
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
                  query: { campaign: campaignStore.details.campaign.id },
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
      </div>
      <div v-else>
        <p>Campaign Loading</p>
      </div>
      <div v-if="true" class="mt-64">
        <pre><code>{{ campaignStore.details }}</code></pre>
      </div>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import router, { ENTITY_ROUTE, HOME_ROUTE } from "@/router";
import { useCampaignStore } from "@/stores/campaign";
import { idValidator, type CampaignEntity } from "@/utils/backendTypes";
import { computed, onBeforeMount } from "vue";
import DOMPurify from "dompurify";
import BaseButton from "@/components/Base/BaseButton.vue";
import CampaignGMSettings from "@/components/Campaign/CampaignGMSettings.vue";
import AddEntityToCampaignButton from "@/components/Campaign/AddEntityToCampaignButton.vue";
import BulletPoint from "@/components/Base/BulletPoint.vue";

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

const descHTML = computed(() =>
  campaignStore.details
    ? DOMPurify.sanitize(campaignStore.details.campaign.desc)
    : ""
);

const entitiesForAccount = (accountId: string): CampaignEntity[] =>
  campaignStore.details?.entities.filter(
    (entity) => entity.owner === accountId
  ) ?? [];
</script>
