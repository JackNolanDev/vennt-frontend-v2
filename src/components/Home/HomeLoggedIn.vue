<template>
  <PageLayout>
    <h3>Your Characters</h3>
    <BaseButton
      v-for="character in homeState.characters"
      :key="character.id"
      :to="{ name: ENTITY_ROUTE, params: { id: character.id } }"
    >
      <template #customIcon>
        <BulletPoint :entity="character"></BulletPoint>
      </template>
      {{ character.name }} - Level: {{ xp2Level(character.attributes.xp) }}
    </BaseButton>
    <BaseButton :to="{ name: CREATE_ROUTE }">
      <template #customIcon><BulletPoint></BulletPoint></template>
      Create or Import a new character
    </BaseButton>
    <h3>Your Campaigns</h3>
    <BaseButton
      v-for="campaign in homeState.campaigns"
      :key="campaign.id"
      :to="{ name: CAMPAIGN_ROUTE, params: { campaignId: campaign.id } }"
    >
      <template #customIcon><BulletPoint></BulletPoint></template>
      {{ campaign.name }} ({{ campaign.role }})
    </BaseButton>
    <BaseButton :to="{ name: CAMPAIGN_CREATE_ROUTE }">
      <template #customIcon><BulletPoint></BulletPoint></template>
      Create a new Campaign
    </BaseButton>
    <PendingCampaignInvitationsSection
      v-if="homeState.campaignInvitations.length > 0"
    ></PendingCampaignInvitationsSection>
    <h3>Your Cogs</h3>
    <BaseButton
      v-for="cog in homeState.cogs"
      :key="cog.id"
      :to="{ name: ENTITY_ROUTE, params: { id: cog.id } }"
    >
      <template #customIcon>
        <BulletPoint :entity="cog"></BulletPoint>
      </template>
      {{ cog.name }} - Level:
      {{
        cog.computed_attributes?.l.val ?? cog.attributes.l ?? cog.attributes.L
      }}
    </BaseButton>
    <BaseButton :to="{ name: CREATE_COG_ROUTE }">
      <template #customIcon><BulletPoint></BulletPoint></template>
      Create a new Cog
    </BaseButton>
  </PageLayout>
</template>

<script setup lang="ts">
import {
  CAMPAIGN_CREATE_ROUTE,
  CAMPAIGN_ROUTE,
  CREATE_COG_ROUTE,
  CREATE_ROUTE,
  ENTITY_ROUTE,
} from "@/router";
import BaseButton from "../Base/BaseButton.vue";
import PageLayout from "../Base/PageLayout.vue";
import { xp2Level } from "@/utils/attributeUtils";
import BulletPoint from "../Base/BulletPoint.vue";
import PendingCampaignInvitationsSection from "./PendingCampaignInvitationsSection.vue";
import { useHomeStore } from "@/stores/home";

const homeState = useHomeStore();
homeState.fetchHomeData();
</script>
