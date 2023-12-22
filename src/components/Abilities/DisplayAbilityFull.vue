<template>
  <p
    v-if="ability.custom_fields?.path && !hiddenFields?.path"
    class="mt-16 mb-0 text-block"
  >
    <i
      ><RouterLink v-if="pathIsLink" :to="pathLink" class="stealth">{{
        ability.custom_fields.path
      }}</RouterLink>
      <span v-else>{{ ability.custom_fields.path }}</span></i
    >
  </p>
  <DisplayAbilityUseCost :ability="ability"></DisplayAbilityUseCost>
  <div v-if="ability.custom_fields?.range" class="mt-16 mb-0 text-block">
    <b>Range:</b> {{ ability.custom_fields.range }}
  </div>
  <div v-if="!hiddenFields?.effect">
    <p class="mt-16 mb-0 text-block"><b>Effect:</b></p>
    <DisplayAbilityEffect
      :ability="ability"
      :flavor="true"
      :attrs="attrs"
    ></DisplayAbilityEffect>
  </div>
</template>

<script setup lang="ts">
import router, { WIKI_PATHS_ROUTE, WIKI_PATHS_SPECIFIC_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import type { ComputedAttributes, EntityAbility } from "vennt-library";
import { stringToLinkID } from "@/utils/textUtils";
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";
import DisplayAbilityEffect from "./DisplayAbilityEffect.vue";
import DisplayAbilityUseCost from "./DisplayAbilityUseCost.vue";

const props = defineProps<{
  ability: EntityAbility;
  attrs?: ComputedAttributes;
  noWikiLinks?: boolean;
  hiddenFields?: {
    path?: boolean;
    effect?: boolean;
  };
}>();
const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

const pathIsLink = computed(() => {
  return (
    props.ability.custom_fields?.path &&
    !props.noWikiLinks &&
    jsonStorage.abilities.paths.some(
      (path) => path.name === props.ability.custom_fields?.path,
    )
  );
});
const pathLink = computed((): RouteLocationRaw => {
  const pathAbility = jsonStorage.abilities.abilities.find(
    (pathAbility) => pathAbility.name === props.ability.name,
  );
  const campaign = router.currentRoute.value.query.campaign;
  const query = entityStore.entity
    ? {
        entity: entityStore.entity.entity.id,
        ...(campaign && { campaign }),
      }
    : router.currentRoute.value.query;
  if (pathAbility && pathAbility.custom_fields?.path) {
    return {
      name: WIKI_PATHS_SPECIFIC_ROUTE,
      params: { path: stringToLinkID(pathAbility.custom_fields.path) },
      query,
      hash: "#" + stringToLinkID(pathAbility.name),
    };
  }
  if (props.ability.custom_fields?.path) {
    return {
      name: WIKI_PATHS_SPECIFIC_ROUTE,
      params: { path: stringToLinkID(props.ability.custom_fields.path) },
      query,
      hash: "#top",
    };
  }
  return { name: WIKI_PATHS_ROUTE, query };
});
</script>
