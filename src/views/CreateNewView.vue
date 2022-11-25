<template>
  <BaseLayout>
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
      <h2>Step 1: Choose a name</h2>
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
      <h2>Step 2: Create your backstory</h2>
      <CreateSectionBackstory></CreateSectionBackstory>
      <h2>Step 3: Choose a Gift</h2>
      <CreateSectionGift></CreateSectionGift>
      <h2>Step 4: Attribute scores</h2>
      <CreateSectionAttributes></CreateSectionAttributes>
      <h2>Step 5: Decide your Quests</h2>
      <CreateSectionQuests></CreateSectionQuests>
      <h2>Step 6: Beginner Boons</h2>
      <CreateSectionBoons></CreateSectionBoons>
      <h2>Step 7: XP and Abilities</h2>
      <CreateSectionXP></CreateSectionXP>
      <h2>Step 8: Finish the character</h2>
      <div class="mb-128"></div>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import CreateSectionName from "@/components/Create/CreateSectionName.vue";
import BaseNav from "@/components/Nav/BaseNav.vue";
import CreateSectionBackstory from "@/components/Create/CreateSectionBackstory.vue";
import CreateSectionGift from "@/components/Create/CreateSectionGift.vue";
import CombatStats from "@/components/CombatStats/CombatStats.vue";
import { useCharacterCreateStore } from "@/stores/characterCreate";
import CreateSectionAttributes from "@/components/Create/CreateSectionAttributes.vue";
import CreateSectionQuests from "@/components/Create/CreateSectionQuests.vue";
import CreateSectionBoons from "@/components/Create/CreateSectionBoons.vue";
import CreateSectionXP from "@/components/Create/CreateSectionXP.vue";

const characterCreateStore = useCharacterCreateStore();
characterCreateStore.loadFromLocalStorage();
</script>
