<template>
  <BaseLayout class="nav sidebar">
    <template #nav><BaseNav></BaseNav></template>
    <template #sidebar>
      <CombatStats
        :entity="characterCreateStore.collectedCharacter"
        :use-copyable-dice="false"
        :show-items="true"
      ></CombatStats>
    </template>
    <PageLayout>
      <h1 class="centeredText">CHARACTER CREATION</h1>
      <p class="textBlock">
        Current version:
        <a
          href="https://vennt.fandom.com/wiki/Character_Creation?oldid=4426"
          target="_blank"
        >
          Revision as of 16:44, 15 March 2022
        </a>
      </p>
      <h2 class="step">Choose a name</h2>
      <p class="textBlock">
        This follows the guide on the
        <a
          href="https://vennt.fandom.com/wiki/Character_Creation"
          target="_blank"
        >
          character creation wiki page</a
        >.
      </p>
      <CreateSectionName></CreateSectionName>
      <h2 class="step">Create your backstory</h2>
      <CreateSectionBackstory></CreateSectionBackstory>
      <h2 class="step">Choose a Gift</h2>
      <CreateSectionGift></CreateSectionGift>
      <h2 class="step">Attribute scores</h2>
      <CreateSectionAttributes></CreateSectionAttributes>
      <h2 class="step">Decide your Quests</h2>
      <CreateSectionQuests></CreateSectionQuests>
      <h2 class="step">Beginner Boons</h2>
      <CreateSectionBoons></CreateSectionBoons>
      <h2 class="step">XP and Abilities</h2>
      <CreateSectionXP></CreateSectionXP>
      <h2 class="step">Finish the character</h2>
      <p class="textBlock">
        Click the "Create Character" button to officially create the character.
      </p>
      <p class="textBlock">
        Click the "Clear Character" button to delete this character and start
        again.
      </p>
      <div class="alignRow gap wrap split mt-8 mb-128">
        <ConfirmationModal
          trigger-class="primary"
          id="create-character-modal"
          @main-button="createCharacter"
        >
          <template #triggerButton>Create Character</template>
          <template #mainButton>Create Character</template>
          <template #title>Continue with Character Creation?</template>
          <p class="mt-0 mb-0">
            Are you sure you are done editing this character? Most fields will
            still be editable once you save this character to the server.
          </p>
        </ConfirmationModal>
        <ConfirmationModal
          trigger-class="clear"
          id="clear-character-modal"
          @main-button="clearCharacter"
        >
          <template #triggerButton>Clear Character</template>
          <template #mainButton>Delete Character</template>
          <template #title>Delete your progress on this character?</template>
          <p class="mt-0 mb-0">
            Are you sure you want to delete your progress on this character?
            Your selections will not be saved or recoverable.
          </p>
        </ConfirmationModal>
      </div>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import CreateSectionName from "@/components/Create/CreateSectionName.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import CreateSectionBackstory from "@/components/Create/CreateSectionBackstory.vue";
import CreateSectionGift from "@/components/Create/CreateSectionGift.vue";
import CombatStats from "@/components/CombatStats/CombatStats.vue";
import { useCharacterCreateStore } from "@/stores/characterCreate";
import CreateSectionAttributes from "@/components/Create/CreateSectionAttributes.vue";
import CreateSectionQuests from "@/components/Create/CreateSectionQuests.vue";
import CreateSectionBoons from "@/components/Create/CreateSectionBoons.vue";
import CreateSectionXP from "@/components/Create/CreateSectionXP.vue";
import ConfirmationModal from "@/components/Base/ConfirmationModal.vue";
import router, { CREATE_ROUTE, ENTITY_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";

const characterCreateStore = useCharacterCreateStore();
const entityStore = useEntityStore();
const jsonStore = useJsonStore();

characterCreateStore.loadFromLocalStorage();
jsonStore.fetchShopItems();

const createCharacter = () => {
  entityStore.addCollectedEntity(characterCreateStore.collectedCharacter, {
    redirectName: ENTITY_ROUTE,
    clearCharacterCreation: true,
  });
};

const clearCharacter = () => {
  characterCreateStore.clearCharacter();
  router.push({ name: CREATE_ROUTE });
};
</script>

<style scoped>
h2.step {
  counter-increment: step-counter;
}
.step::before {
  content: "Step " counter(step-counter) ": ";
}
</style>
