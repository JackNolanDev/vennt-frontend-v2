<template>
  <BaseLayout>
    <template #nav><BaseNav></BaseNav></template>
    <template #sidebar><div>hi</div></template>
    <PageLayout>
      <h1 class="centeredText">CHARACTER CREATION</h1>
      <p class="textBlock">
        Current version:
        <a
          href="https://vennt.fandom.com/wiki/Character_Creation?oldid=4426"
          target="_blank"
          class="link"
        >
          Revision as of 16:44, 15 March 2022
        </a>
      </p>
      <!-- ----- STEP 1 ----- -->
      <h2>Step 1: Choose a name</h2>
      <p class="textBlock">
        This follows the guide on the
        <a
          href="https://vennt.fandom.com/wiki/Character_Creation"
          target="_blank"
          class="link"
        >
          character creation wiki page</a
        >.
      </p>
      <RandomNamesSection></RandomNamesSection>
      <!-- ----- STEP 2 ----- -->
      <h2>Step 2: Create your backstory</h2>
      <p class="textBlock">
        For now, this process must be completed in a seperate document. Follow
        <a
          href="https://vennt.fandom.com/wiki/Backstory"
          target="_blank"
          class="link"
        >
          this wiki page
        </a>
        for help with coming up a character concept and describing your
        backstory.
      </p>
      <!-- ----- STEP 3 ----- -->
      <h2>Step 3: Choose a Gift</h2>
      <p class="textBlock">
        <i>
          Most legends are born gifted in some way. Mozart was gifted in music,
          Achilles was gifted in combat, and Merlin was gifted in magic. There
          are nine gifts available to choose from as a hero of Amnis, each one
          providing unique boons to your character.
        </i>
      </p>
      <GiftSelection></GiftSelection>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import GiftSelection from "@/components/Create/GiftSelection.vue";
import RandomNamesSection from "@/components/Create/RandomNamesSection.vue";
import BaseNav from "@/components/Nav/BaseNav.vue";
</script>
