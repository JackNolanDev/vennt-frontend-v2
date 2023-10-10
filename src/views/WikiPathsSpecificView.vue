<template>
  <PageLayout>
    <div v-if="pathAndAbilities">
      <h1 id="top">{{ pathAndAbilities.path.name }}</h1>
      <div v-html="renderMarkdown(pathAndAbilities.path.desc)"></div>
      <p v-if="pathAndAbilities.path.reqs">
        <b class="mr-8">Requirements:</b>
        <WikiLinksSingleLine
          :line="pathAndAbilities.path.reqs"
        ></WikiLinksSingleLine>
      </p>
      <p v-if="pathAndAbilities.path.completionBonus">
        <b>Path Completion Bonus:</b>
        {{ pathAndAbilities.path.completionBonus }}
      </p>
      <div class="separator mb-64"></div>
      <div
        v-for="ability in pathAndAbilities.abilities"
        :key="ability.name"
        class="mb-64"
      >
        <div class="alignRow gap copy-reveal">
          <h2 :id="stringToLinkID(ability.name)">
            <AbilityName
              v-if="ability.entityAbility"
              :ability="ability.entityAbility"
              :show-highlight="true"
            ></AbilityName>
            <AbilityName v-else :ability="ability"></AbilityName>
          </h2>
          <BaseCopyButton
            :text="copyLink(ability)"
            :link="true"
            :title="`Copy link: ${copyLink(ability)}`"
            class="copy-button"
          ></BaseCopyButton>
        </div>
        <DisplayAbilityFull
          :ability="ability"
          :hidden-fields="{ path: true, effect: true }"
        ></DisplayAbilityFull>
        <DisplayAbilityAdditionalDetails
          :ability="ability"
        ></DisplayAbilityAdditionalDetails>
        <DisplayAbilityEffect
          :ability="ability"
          :flavor="true"
        ></DisplayAbilityEffect>
        <div v-if="entityStore.entity">
          <BaseButton
            v-if="ability.entityAbility"
            :to="{
              name: ENTITY_ABILITIES_ROUTE,
              params: {
                id: entityStore.entity.entity.id,
                detail: ability.entityAbility.id,
              },
              query: {
                ...($route.query.campaign && {
                  campaign: $route.query.campaign,
                }),
              },
            }"
            icon="person"
            class="secondary wide mt-24"
            >View for {{ entityStore.entity.entity.name }}</BaseButton
          >
          <AddSearchAbilityButton
            v-else
            :ability="ability"
          ></AddSearchAbilityButton>
        </div>
      </div>
    </div>
    <div v-else>Not found</div>
  </PageLayout>
</template>

<script setup lang="ts">
import AddSearchAbilityButton from "@/components/Abilities/AddSearchAbilityButton.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import DisplayAbilityAdditionalDetails from "@/components/Abilities/DisplayAbilityAdditionalDetails.vue";
import DisplayAbilityEffect from "@/components/Abilities/DisplayAbilityEffect.vue";
import DisplayAbilityFull from "@/components/Abilities/DisplayAbilityFull.vue";
import BaseCopyButton from "@/components/Base/BaseCopyButton.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import WikiLinksSingleLine from "@/components/Wiki/WikiLinksSingleLine.vue";
import router, { ENTITY_ABILITIES_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import type { EntityAbility, FullEntityAbility } from "@/utils/backendTypes";
import { renderMarkdown, stringToLinkID } from "@/utils/textUtils";
import { computed, watch } from "vue";
import AbilityName from "@/components/Abilities/AbilityName.vue";

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

// Implements the jump to element logic for after abilities are delivered browser
watch(
  () => [jsonStorage.abilities],
  () => {
    const baseHash = router.currentRoute.value.hash;
    if (!baseHash) {
      return;
    }
    const hash = baseHash.substring(1);
    setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        console.log(`Couldn't find element: ${hash}`);
      }
    }, 50);
  }
);

const pathAndAbilities = computed(() => {
  const path = jsonStorage.abilities.paths.find(
    (path) =>
      stringToLinkID(path.name) === router.currentRoute.value.params.path
  );

  if (!path) {
    return null;
  }

  let abilities: Array<EntityAbility & { entityAbility?: FullEntityAbility }> =
    jsonStorage.abilities.abilities.filter(
      (ability) => ability.custom_fields?.path === path.name
    );

  if (entityStore.entity) {
    abilities = abilities.map((ability) => {
      const found = entityStore.entity?.abilities.find(
        (owned) => owned.name === ability.name
      );
      if (found) {
        ability.entityAbility = found;
      }
      return ability;
    });
  }

  return { path, abilities };
});

const copyLink = (ability: EntityAbility) =>
  `${window.location.origin}${router.currentRoute.value.path}#${stringToLinkID(
    ability.name
  )}`;
</script>

<style scoped>
.copy-button {
  display: none;
}
.copy-reveal:hover .copy-button {
  display: block;
}
</style>
