<template>
  <h1>Combat</h1>
  <DamageCalculatorLink v-if="entityStore.canEdit"></DamageCalculatorLink>
  <CombatTimeButtons v-if="entityStore.canEdit"></CombatTimeButtons>
  <h2>Basic Actions</h2>
  <BasicActionsTable></BasicActionsTable>
  <h2>Usable Abilities</h2>
  <AbilityTable
    :abilities="useableAbilities"
    :attrs="entityStore.computedAttributes"
  ></AbilityTable>
  <h2>Usable Weapons</h2>
  <ItemTable
    :items="useableWeapons"
    :hide-count="true"
    item-label="Weapons"
  ></ItemTable>
  <div class="mb-128"></div>
</template>

<script setup lang="ts">
import AbilityTable from "@/components/Abilities/AbilityTable.vue";
import ItemTable from "@/components/Items/ItemTable.vue";
import CombatTimeButtons from "@/components/Combat/CombatTimeButtons.vue";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { canUseAbility } from "@/utils/abilityUtils";
import { computed } from "vue";
import BasicActionsTable from "@/components/Combat/BasicActions/BasicActionsTable.vue";
import DamageCalculatorLink from "@/components/Entities/DamageCalculatorLink.vue";

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();
jsonStorage.fetchWeaponTypes();

const useableAbilities = computed(() =>
  entityStore.sortedAbilities.filter((ability) =>
    canUseAbility(ability, entityStore.computedAttributes),
  ),
);
const useableWeapons = computed(() =>
  entityStore.consolidatedItems
    .filter(
      (item) =>
        !item.custom_fields?.in_storage &&
        item.type === "weapon" &&
        (item.active || item.custom_fields?.category === "Grenade"),
    )
    .concat(jsonStorage.defaultWeapons),
);
</script>
