<template>
  <h1>Combat</h1>
  <AbilityTable :abilities="useableAbilities"></AbilityTable>
  <h2>Usable weapons</h2>
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
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { canUseAbility } from "@/utils/abilityUtils";
import { computed } from "vue";

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();
jsonStorage.fetchWeaponTypes();

const useableAbilities = computed(() =>
  entityStore.sortedAbilities.filter((ability) => canUseAbility(ability))
);
const useableWeapons = computed(() =>
  entityStore.consolidatedItems
    .filter(
      (item) =>
        item.type === "weapon" &&
        (item.active || item.custom_fields?.category === "Grenade")
    )
    .concat(jsonStorage.defaultWeapons)
);
</script>
