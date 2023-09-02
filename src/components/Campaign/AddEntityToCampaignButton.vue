<template>
  <ConfirmationModal
    v-if="campaignStore.role !== 'SPECTATOR'"
    id="add-entity-to-campaign"
    triggerIcon="add"
    triggerClass="primary wide mt-16"
    :mainButtonDisabled="state.selected === ''"
    @openModal="fetchEntityList"
    @mainButton="addSelected"
  >
    <template #triggerButton
      >Add Character {{ campaignStore.role === "GM" ? "/ Cog " : "" }}to
      campaign</template
    >
    <template #title>Choose an entity to save</template>
    <template #mainButton>{{ mainButtonText }}</template>
    <div v-if="homeState.entities.length > 0">
      <BaseRadioButtons
        v-if="Object.keys(entityOptions).length > 0"
        :options="entityOptions"
        :selected="state.selected"
        @selectedUpdated="(selected) => (state.selected = selected)"
      ></BaseRadioButtons>
      <div v-else>No valid entities. 😔 Maybe go make one?</div>
    </div>
    <div v-else>Entities loading...</div>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import ConfirmationModal from "../Base/ConfirmationModal.vue";
import { computed, reactive } from "vue";
import type { HTMLString } from "@/utils/backendTypes";
import { xp2Level } from "@/utils/attributeUtils";
import BaseRadioButtons from "../Base/BaseRadioButtons.vue";
import { useHomeStore } from "@/stores/home";

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
      (entity) => campaignStore.role !== "GM" && entity.type === "CHARACTER"
    )
    .reduce<Record<string, HTMLString>>((acc, entity) => {
      acc[entity.id] = `${entity.name} - Level: ${
        entity.type === "COG"
          ? entity.attributes.L
          : xp2Level(entity.attributes.xp)
      }`;
      return acc;
    }, {})
);

const mainButtonText = computed(() => {
  const found = homeState.entities.find(
    (entity) => entity.id === state.selected
  );
  return found ? `Add ${found.name}` : "Choose entity";
});

const addSelected = () => {
  const found = homeState.entities.find(
    (entity) => entity.id === state.selected
  );
  if (!found) {
    return;
  }
  campaignStore.addEntityToCampaign({
    entity_id: found.id,
    gm_only: campaignStore.role === "GM" && found.type === "COG",
  });
};
</script>
