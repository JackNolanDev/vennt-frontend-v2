<template>
  <h1>Abilities</h1>
  <EntitySpentXP></EntitySpentXP>
  <AbilityTable
    :abilities="entityStore.sortedAbilities"
    :attrs="entityStore.entityAttributes"
  ></AbilityTable>
  <BaseButton
    v-if="entityStore.entity?.entity.id && entityStore.canEdit"
    :to="{
      name: ENTITY_ABILITIES_ROUTE,
      params: router.currentRoute.value.params,
      query: { ...router.currentRoute.value.query, new: 'ability' },
    }"
    icon="add"
    class="wide mt-24"
    >Add custom ability</BaseButton
  >
  <BaseButton
    v-if="entityStore.entity?.entity.id && entityStore.canEdit"
    :to="{
      name: WIKI_PATHS_ROUTE,
      query: {
        entity: entityStore.entity.entity.id,
        campaign: campaignStore.details?.campaign.id,
      },
    }"
    icon="find_in_page"
    class="wide"
    >Find abilities via wiki</BaseButton
  >
  <AbilitySearch v-if="showEditSection"></AbilitySearch>
  <div class="mb-128"></div>
</template>
<script setup lang="ts">
import AbilitySearch from "@/components/Abilities/AbilitySearch.vue";
import AbilityTable from "@/components/Abilities/AbilityTable.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import EntitySpentXP from "@/components/Entities/EntitySpentXP.vue";
import router, { ENTITY_ABILITIES_ROUTE, WIKI_PATHS_ROUTE } from "@/router";
import { useCampaignStore } from "@/stores/campaign";
import { useEntityStore } from "@/stores/entity";
import { computed } from "vue";

const entityStore = useEntityStore();
const campaignStore = useCampaignStore();

const showEditSection = computed(
  () => entityStore.canEdit && entityStore.entity?.entity.type === "CHARACTER"
);
</script>
