<template>
  <BaseLayout class="nav sidebar">
    <template #nav><BaseNav></BaseNav></template>
    <template #sidebar>
      <CombatStats
        :entity="cogCreateStore.collectedCog"
        :entity-attrs="cogCreateStore.cogAttrs"
        :use-copyable-dice="false"
        :show-abilities="true"
      ></CombatStats>
    </template>
    <PageLayout>
      <h1 class="centeredText">COG CREATION</h1>
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
        <pre class="mt-64"><code>{{ cogCreateStore.collectedCog }}</code></pre>
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
import CreateCogTypeSection from "@/components/Cog/CreateCogTypeSection.vue";
import BaseFullFeaturedTextEditor from "@/components/Base/BaseFullFeaturedTextEditor.vue";
import CreateCogAbilitySection from "@/components/Cog/CreateCogAbilitySection.vue";

const cogCreateStore = useCogCreateStore();
cogCreateStore.loadFromLocalStorage();
</script>

<style scoped>
h2.step {
  counter-increment: step-counter;
}
.step::before {
  content: "Step " counter(step-counter) ": ";
}
</style>
