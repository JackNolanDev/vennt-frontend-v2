<template>
  <table v-if="abilities.length > 0" class="no-border">
    <thead class="main-table">
      <tr>
        <th>Ability</th>
        <th>Activation</th>
        <th class="ability-effect">
          <div class="alignRow gap">
            Effect<input
              v-if="searchId"
              placeholder="Ability Search"
              type="text"
              inputmode="search"
              v-model="state.search"
              :id="searchId"
              class="input"
            />
          </div>
        </th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(ability, index) in filteredAbilities"
        v-bind:key="index"
        v-bind:id="stringToLinkID(ability.id)"
        v-bind:class="abilityOpened(ability) ? 'selected' : ''"
      >
        <td
          :class="{
            highlight: ability.custom_fields?.highlight,
            [ability.custom_fields?.highlight ?? 'red']: true,
          }"
          class="ability-name"
        >
          <AbilityName :ability="ability"></AbilityName>
        </td>
        <td>{{ ability.custom_fields?.activation }}</td>
        <td class="ability-effect condense-child-text">
          <DisplayAbilityEffect
            :ability="ability"
            :attrs="attrs"
          ></DisplayAbilityEffect>
        </td>
        <td class="no-padding action-button">
          <BaseButton
            v-if="abilityOpened(ability)"
            :to="abilityLink(ability)"
            icon="keyboard_arrow_left"
            title="Close ability details"
          ></BaseButton>
          <BaseButton
            v-else
            :to="abilityLink(ability)"
            icon="keyboard_arrow_right"
            title="Open ability details"
          ></BaseButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import router, { ENTITY_ABILITIES_ROUTE } from "@/router";
import type { ComputedAttributes, FullEntityAbility } from "vennt-library";
import { stringToLinkID } from "@/utils/textUtils";
import type { RouteLocationRaw } from "vue-router";
import DisplayAbilityEffect from "./DisplayAbilityEffect.vue";
import BaseButton from "../Base/BaseButton.vue";
import AbilityName from "./AbilityName.vue";
import { computed, reactive } from "vue";

const props = defineProps<{
  abilities: FullEntityAbility[];
  attrs?: ComputedAttributes;
  searchId?: string;
}>();

const state = reactive({ search: "" });

const filteredAbilities = computed(() => {
  if (!state.search || !props.searchId) {
    return props.abilities;
  }
  const searchStr = state.search.toLowerCase();
  return props.abilities.filter((ability) =>
    ability.name.toLowerCase().includes(searchStr),
  );
});

const abilityOpened = (ability: FullEntityAbility): boolean =>
  router.currentRoute.value.params.detail === ability.id;
const abilityLink = (ability: FullEntityAbility): RouteLocationRaw => {
  if (abilityOpened(ability)) {
    const params = { ...router.currentRoute.value.params };
    delete params.detail;
    return {
      name: router.currentRoute.value.name ?? ENTITY_ABILITIES_ROUTE,
      params,
      query: router.currentRoute.value.query,
    };
  }
  return {
    name: router.currentRoute.value.name ?? ENTITY_ABILITIES_ROUTE,
    params: { ...router.currentRoute.value.params, detail: ability.id },
    query: router.currentRoute.value.query,
  };
};
</script>

<style scoped>
thead.main-table {
  font-size: 15pt;
  text-align: left;
}

td.no-padding {
  padding: 0;
}
.action-button {
  width: 42px;
}
.ability-name {
  font-size: 14pt;
}

/* skip tables in the ability table so it doesn't get too messy */
.ability-effect :deep(table) {
  display: none;
}

@container page (max-width: 750px) {
  .ability-effect {
    display: none;
  }
}
</style>
