<template>
  <BaseLayout class="nav sidebar">
    <template #nav><WikiNav></WikiNav></template>
    <template #sidebar>
      <WikiSidePanel></WikiSidePanel>
    </template>
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
          <div v-if="entityStore.entity">
            <BaseButton
              v-if="
                entityStore.entity.abilities.some(
                  (owned) => owned.name === ability.name
                )
              "
              :to="{
                name: ENTITY_ABILITIES_ROUTE,
                params: {
                  id: entityStore.entity.entity.id,
                  detail: entityStore.entity.abilities.find(
                    (owned) => owned.name === ability.name
                  )?.id,
                },
              }"
              icon="person"
              class="primary wide mt-24"
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
  </BaseLayout>
</template>

<script setup lang="ts">
import DisplayAbilityAdditionalDetails from "@/components/Abilities/DisplayAbilityAdditionalDetails.vue";
import DisplayAbilityEffect from "@/components/Abilities/DisplayAbilityEffect.vue";
import DisplayAbilityFull from "@/components/Abilities/DisplayAbilityFull.vue";
import BaseCopyButton from "@/components/Base/BaseCopyButton.vue";
import BaseLayout from "@/components/Base/BaseLayout.vue";
import WikiNav from "@/components/Wiki/WikiNav.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import WikiLinksSingleLine from "@/components/Wiki/WikiLinksSingleLine.vue";
import WikiSidePanel from "@/components/Wiki/WikiSidePanel.vue";
import router, { ENTITY_ABILITIES_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { idValidator, type EntityAbility } from "@/utils/backendTypes";
import { renderMarkdown, stringToLinkID } from "@/utils/textUtils";
import { computed, onBeforeMount, watch } from "vue";
import AddSearchAbilityButton from "@/components/Abilities/AddSearchAbilityButton.vue";
import BaseButton from "@/components/Base/BaseButton.vue";

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();
jsonStorage.fetchAbilities();

onBeforeMount(() => {
  const id = idValidator.safeParse(router.currentRoute.value.query.entity);
  if (!id.success) {
    return;
  }
  if (!entityStore.entity || entityStore.entity.entity.id !== id.data) {
    entityStore.clearLocalEntity();
    entityStore.fetchCollectedEntity(id.data);
  }
});

// Implements the jump to element logic for after abilities arrive to browser
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
