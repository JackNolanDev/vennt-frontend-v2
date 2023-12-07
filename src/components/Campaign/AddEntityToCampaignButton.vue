<template>
  <ConfirmationModal
    v-if="campaignStore.role !== CAMPAIGN_ROLE_SPECTATOR"
    id="add-entity-to-campaign"
    triggerIcon="add"
    triggerClass="primary wide mt-16"
    :mainButtonDisabled="state.selected === ''"
    @openModal="fetchEntityList"
    @mainButton="addSelected"
  >
    <template #triggerButton
      >Add Character
      {{ campaignStore.role === CAMPAIGN_ROLE_GM ? "/ Cog " : "" }}to
      campaign</template
    >
    <template #title>Choose an entity to save</template>
    <template #mainButton>{{ mainButtonText }}</template>
    <div class="alignRow column gap">
      <BaseButton
        :to="{
          name: CREATE_NEW_ROUTE,
          query: { campaign: campaignStore.details?.campaign.id },
        }"
        icon="person"
        class="primary wide"
        >Create new Character</BaseButton
      >
      <BaseButton
        v-if="campaignStore.role === CAMPAIGN_ROLE_GM"
        :to="{
          name: CREATE_NEW_COG_ROUTE,
          query: { campaign: campaignStore.details?.campaign.id },
        }"
        icon="manufacturing"
        class="primary wide"
        >Create new COG</BaseButton
      >
    </div>
    <div v-if="homeState.entities.length > 0">
      <div v-if="Object.keys(entityOptions).length > 0">
        <div class="separator mt-8 mb-8"></div>
        <BaseRadioButtons
          :options="entityOptions"
          :selected="state.selected"
          @selectedUpdated="(selected) => (state.selected = selected)"
        ></BaseRadioButtons>
      </div>
    </div>
    <div v-else>Entities loading...</div>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import ConfirmationModal from "../Base/ConfirmationModal.vue";
import { computed, reactive } from "vue";
import {
  type HTMLString,
  titleText,
  CAMPAIGN_ROLE_GM,
  CAMPAIGN_ROLE_SPECTATOR,
} from "vennt-library";
import { xp2Level } from "@/utils/attributeUtils";
import BaseRadioButtons from "../Base/BaseRadioButtons.vue";
import { useHomeStore } from "@/stores/home";
import BaseButton from "../Base/BaseButton.vue";
import { CREATE_NEW_COG_ROUTE, CREATE_NEW_ROUTE } from "@/router";

const state = reactive<{ selected: string }>({
  selected: "",
});
const homeState = useHomeStore();
const campaignStore = useCampaignStore();

const fetchEntityList = async () => {
  if (homeState.entities.length === 0) {
    homeState.listEntities();
  }
};

const entityOptions = computed(() =>
  homeState.entities
    .filter(
      (entity) =>
        (campaignStore.role === CAMPAIGN_ROLE_GM ||
          entity.type === "CHARACTER") &&
        !campaignStore.details?.entities.some(
          (existingEntity) => existingEntity.entity_id === entity.id,
        ),
    )
    .reduce<Record<string, HTMLString>>((acc, entity) => {
      acc[entity.id] = `${entity.name} - Level: ${
        entity.type === "COG"
          ? entity.attributes.L
          : xp2Level(entity.attributes.xp)
      } ${campaignStore.role === "GM" ? `(${titleText(entity.type)})` : ""}`;
      return acc;
    }, {}),
);

const mainButtonText = computed(() => {
  const found = homeState.entities.find(
    (entity) => entity.id === state.selected,
  );
  return found ? `Add ${found.name}` : "Choose entity";
});

const addSelected = () => {
  const found = homeState.entities.find(
    (entity) => entity.id === state.selected,
  );
  if (!found) {
    return;
  }
  campaignStore.addEntityToCampaign({
    entity_id: found.id,
    gm_only: campaignStore.role === CAMPAIGN_ROLE_GM && found.type === "COG",
  });
};
</script>
