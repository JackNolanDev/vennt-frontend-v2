<template>
  <BaseLayout>
    <template #nav><BaseNav></BaseNav></template>
    <template #sidebar>
      <CombatStats
        :entity="characterCreateStore.collectedCharacter"
        :use-copyable-dice="false"
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

const characterCreateStore = useCharacterCreateStore();
characterCreateStore.loadFromLocalStorage();
</script>
