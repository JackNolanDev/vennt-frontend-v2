<template>
  <BaseLayout class="nav sidebar">
    <template #nav><BaseNav></BaseNav></template>
    <template #sidebar>
      <WikiMenu :tree="jsonStorage.pathMap"></WikiMenu>
    </template>
    <PageLayout>
      <div v-if="pathAndAbilities">
        <h1>{{ pathAndAbilities.path.name }}</h1>
        <p>{{ pathAndAbilities.path.desc }}</p>
        <p v-if="pathAndAbilities.path.reqs">
          <b>Requirements:</b> {{ pathAndAbilities.path.reqs }}
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
            <h2 :id="stringToLinkID(ability.name)">{{ ability.name }}</h2>
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
        </div>
      </div>
      <div v-else>Not found</div>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import DisplayAbilityAdditionalDetails from "@/components/Abilities/DisplayAbilityAdditionalDetails.vue";
import DisplayAbilityEffect from "@/components/Abilities/DisplayAbilityEffect.vue";
import DisplayAbilityFull from "@/components/Abilities/DisplayAbilityFull.vue";
import BaseCopyButton from "@/components/Base/BaseCopyButton.vue";
import BaseLayout from "@/components/Base/BaseLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import WikiMenu from "@/components/Wiki/WikiMenu.vue";
import router from "@/router";
import { useJsonStore } from "@/stores/jsonStorage";
import type { EntityAbility } from "@/utils/backendTypes";
import { stringToLinkID } from "@/utils/textUtils";
import { computed } from "vue";

const jsonStorage = useJsonStore();
jsonStorage.fetchAbilities();

const pathAndAbilities = computed(() => {
  const path = jsonStorage.abilities.paths.find(
    (path) =>
      stringToLinkID(path.name) === router.currentRoute.value.params.path
  );

  if (!path) {
    return null;
  }

  const abilities = jsonStorage.abilities.abilities.filter(
    (ability) => ability.custom_fields?.path === path.name
  );

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
