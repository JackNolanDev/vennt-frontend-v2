<template>
  <BaseLayout class="nav sidebar">
    <template #nav
      ><CampaignSettingsNav v-if="campaignStore.details"></CampaignSettingsNav>
      <BaseNav v-else></BaseNav
    ></template>
    <template #sidebar>
      <CombatStats
        :entity="cogCreateStore.collectedCog"
        :use-copyable-dice="false"
        :show-abilities="true"
        :show-full-health="true"
      ></CombatStats>
    </template>
    <PageLayout>
      <h1 class="centeredText">COG CREATION</h1>
      <p v-if="campaignStore.details" class="label-text mb-8">
        <strong>For "{{ campaignStore.details.campaign.name }}"</strong>
      </p>
      <form>
        <p class="textBlock">
          Current version:
          <a
            href="https://vennt.fandom.com/wiki/Cogs?oldid=5671"
            target="_blank"
          >
            Revision as of 19:05, 20 March 2023
          </a>
        </p>
        <h2 class="step">Choose a name</h2>
        <p class="textBlock">
          This follows the guide on the
          <a href="https://vennt.fandom.com/wiki/Cogs" target="_blank">
            cog creation wiki page</a
          >.
        </p>
        <div class="alignRow gap">
          <label for="cog-new-name" class="labelText nowrap">Cog Name:</label>
          <input
            type="text"
            placeholder="Wind Elemental"
            v-model="cogCreateStore.options.name"
            @blur="cogCreateStore.saveToLocalStorage()"
            class="input"
            id="cog-new-name"
          />
        </div>
        <h2 class="step">Describe your Cog</h2>
        <BaseFullFeaturedTextEditor
          v-model="cogCreateStore.options.desc"
          placeholder="Describe your cog here"
          @focusout="cogCreateStore.saveToLocalStorage()"
        ></BaseFullFeaturedTextEditor>
        <h2 class="step">Choose Level</h2>
        <p class="textBlock">
          A Cog has a Level which represents its difficulty. The number of Cogs
          allowed in the Scene and their Level is dependent on the
          <a
            href="https://vennt.fandom.com/wiki/Course_of_Tactics#Encounter_Difficulty"
            target="_blank"
            >Encounter Difficulty</a
          >.
        </p>
        <p>
          Cogs are built using fixed stats and <b>Ability Points (AP)</b> to
          purchase abilities, similar to how PCs use XP to purchase abilities. A
          Cog can purchase <b>twice its Level in AP</b>. Each ability can be
          purchased only once unless otherwise noted.
        </p>
        <div v-if="campaignStore.details && campaignSumPlayerLevel">
          <p>
            For "{{ campaignStore.details.campaign.name }}", the Sum of Players’
            Level (SPL) is: {{ campaignSumPlayerLevel }}.
          </p>
          <div class="cols-3 gap mb-16 encounter-difficulty-buttons">
            <BaseButton
              class="primary"
              @click="setL(campaignSumPlayerLevel * 0.75)"
              >Easy Encounter ({{
                Math.floor(campaignSumPlayerLevel * 0.75)
              }}
              AP)</BaseButton
            >
            <BaseButton class="primary" @click="setL(campaignSumPlayerLevel)"
              >Medium Encounter ({{ campaignSumPlayerLevel }} AP)</BaseButton
            >
            <BaseButton
              class="primary"
              @click="setL(campaignSumPlayerLevel * 1.25)"
              >Hard Encounter ({{
                Math.floor(campaignSumPlayerLevel * 1.25)
              }}
              AP)</BaseButton
            >
          </div>
        </div>
        <div class="alignRow gap">
          <label for="cog-level" class="labelText nowrap">Cog Level:</label>
          <input
            type="number"
            inputmode="numeric"
            placeholder="5"
            v-model.number="cogCreateStore.options.level"
            @blur="cogCreateStore.saveToLocalStorage()"
            class="input"
            id="cog-level"
          />
        </div>
        <h2 class="step">Choose Type</h2>
        <CreateCogTypeSection></CreateCogTypeSection>
        <h2 class="step">Spend Ability Points</h2>
        <CreateCogAbilitySection></CreateCogAbilitySection>
        <h2 class="step">Save your cog</h2>
        <div class="alignRow gap wrap split mt-8 mb-64">
          <ConfirmationModal
            trigger-class="primary"
            id="create-cog-modal"
            @main-button="createCog"
          >
            <template #triggerButton>Save Cog</template>
            <template #mainButton>Save Cog</template>
            <template #title>Save this Cog?</template>
            <p class="mt-0 mb-0">
              Most fields are still editable after they have been saved. If you
              need to edit this again in the cog creator, you can on the
              "settings" page.
            </p>
            <p v-if="campaignStore.details" class="mb-0">
              This cog will automatically be added to the campaign "<strong>{{
                campaignStore.details.campaign.name
              }}</strong
              >". It will be <strong>Hidden</strong> to all players in your
              campaign until manually revealed!
            </p>
          </ConfirmationModal>
          <ConfirmationModal
            trigger-class="clear"
            id="clear-cog-modal"
            @main-button="clearCog"
          >
            <template #triggerButton>Clear Cog</template>
            <template #mainButton>Delete Cog</template>
            <template #title>Delete this Cog?</template>
            <p class="mt-0 mb-0">
              Are you sure you want to delete this Cog? Your selections will not
              be saved or recoverable.
            </p>
          </ConfirmationModal>
        </div>
        <BaseCopyableCode
          :text="cogCreateStore.cogStatBlock"
          class="mb-128"
        ></BaseCopyableCode>
      </form>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import CombatStats from "@/components/CombatStats/CombatStats.vue";
import { useCogCreateStore } from "@/stores/cogCreate";
import { useEntityStore } from "@/stores/entity";
import CreateCogTypeSection from "@/components/Cog/CreateCogTypeSection.vue";
import BaseFullFeaturedTextEditor from "@/components/Base/BaseFullFeaturedTextEditor.vue";
import CreateCogAbilitySection from "@/components/Cog/CreateCogAbilitySection.vue";
import ConfirmationModal from "@/components/Base/ConfirmationModal.vue";
import router, { CREATE_COG_ROUTE, ENTITY_ROUTE } from "@/router";
import { idValidator } from "vennt-library";
import BaseCopyableCode from "@/components/Base/BaseCopyableCode.vue";
import { entityCreationFullyHealed } from "@/utils/entityUtils";
import { optionalIdValidator } from "vennt-library";
import { useCampaignStore } from "@/stores/campaign";
import { computed, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import CampaignSettingsNav from "@/components/Campaign/CampaignSettingsNav.vue";
import BaseButton from "@/components/Base/BaseButton.vue";

const cogCreateStore = useCogCreateStore();
const entityStore = useEntityStore();
const campaignStore = useCampaignStore();
const route = useRoute();

onBeforeMount(() => {
  const campaignIdCheck = optionalIdValidator.safeParse(route.query.campaign);
  if (campaignIdCheck.success && campaignIdCheck.data) {
    campaignStore.fetchCampaign(campaignIdCheck.data, true);
  } else {
    campaignStore.reset();
  }
});

let id: string | undefined = undefined;
if (router.currentRoute.value.query.edit) {
  const editId = idValidator.safeParse(router.currentRoute.value.query.edit);
  if (editId.success) {
    id = editId.data;
  }
}
cogCreateStore.loadFromEntityId(id);

const campaignSumPlayerLevel = computed(
  () =>
    campaignStore.details?.entities
      .filter((entity) => entity.type === "CHARACTER")
      .reduce(
        (sum, character) =>
          sum + Math.floor((character.computed_attributes?.xp.val ?? 0) / 1000),
        0,
      ),
);

const setL = (level: number) => {
  cogCreateStore.options.level = Math.floor(level);
};

const createCog = () => {
  const cog = entityCreationFullyHealed(
    cogCreateStore.collectedCog,
    cogCreateStore.cogAttrs,
  );
  const redirectQuery = campaignStore.details
    ? { campaign: campaignStore.details.campaign.id }
    : undefined;
  entityStore.addCollectedEntity(cog, {
    redirectName: ENTITY_ROUTE,
    redirectQuery: redirectQuery,
    clearCogCreation: true,
    campaignId: campaignStore.details?.campaign.id,
  });
};
const clearCog = () => {
  cogCreateStore.clearCog();
  router.push({
    name: CREATE_COG_ROUTE,
    query: { campaign: campaignStore.details?.campaign.id },
  });
};
</script>

<style scoped>
h2.step {
  counter-increment: step-counter;
}
.step::before {
  content: "Step " counter(step-counter) ": ";
}

@container page (max-width: 600px) {
  .encounter-difficulty-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
