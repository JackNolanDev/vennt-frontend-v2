<template>
  <div v-if="abilities.length > 0" class="card column">
    <div class="alignRow tableData tableHeader">
      <div class="abilityName headerFont">
        <b>Ability</b>
      </div>
      <div class="abilityActivation headerFont">
        <b>Activation</b>
      </div>
      <div class="abilityEffect headerFont">
        <b>Effect</b>
      </div>
    </div>
    <div
      v-for="(ability, index) in abilities"
      v-bind:key="index"
      v-bind:id="stringToLinkID(ability.id)"
      v-bind:class="abilityOpenned(ability) ? 'selected' : ''"
      class="alignRow tableItems"
    >
      <div class="tableData">
        <div class="abilityName">{{ improveTextForDisplay(ability.name) }}</div>
        <div class="abilityActivation">
          {{ ability.custom_fields?.activation }}
        </div>
        <div class="abilityEffect">
          <DisplayAbilityEffect :ability="ability"></DisplayAbilityEffect>
        </div>
      </div>
      <router-link :to="abilityLink(ability)" class="btn basicBtn link">
        <div class="basicBtnContents">
          <span class="material-icons">{{
            abilityOpenned(ability)
              ? "keyboard_arrow_left"
              : "keyboard_arrow_right"
          }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import router, { ENTITY_ABILITIES_ROUTE } from "@/router";
import type { FullEntityAbility } from "@/utils/backendTypes";
import { stringToLinkID, improveTextForDisplay } from "@/utils/textUtils";
import { type RouteLocationRaw, RouterLink } from "vue-router";
import DisplayAbilityEffect from "./DisplayAbilityEffect.vue";

defineProps<{ abilities: FullEntityAbility[] }>();

const abilityOpenned = (ability: FullEntityAbility): boolean =>
  router.currentRoute.value.params.detail === ability.id;
const abilityLink = (ability: FullEntityAbility): RouteLocationRaw => {
  if (abilityOpenned(ability)) {
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
.abilityName {
  width: 20%;
  font-size: 14pt;
}
.abilityActivation {
  width: 15%;
}
.abilityEffect {
  width: 65%;
}

/* Deep selector effects children */
.abilityEffect :deep(p:first-child) {
  margin-top: 0px;
  margin-bottom: 0px;
}
.abilityEffect :deep(p),
.abilityEffect :deep(ul) {
  /* reduce margin so we can condense text a bit more */
  margin-top: 5px;
  margin-bottom: 0px;
}

@container page (max-width: 750px) {
  .abilityName {
    width: 50%;
  }
  .abilityActivation {
    width: 50%;
  }
  .abilityEffect {
    display: none;
  }
}
</style>
