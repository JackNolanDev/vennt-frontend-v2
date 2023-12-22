<template>
  <PageLayout>
    <h1>Combat</h1>
    <DamageCalculatorLink v-if="entityStore.canEdit"></DamageCalculatorLink>
    <CombatTimeButtons v-if="entityStore.canEdit"></CombatTimeButtons>
    <h2>Basic Actions</h2>
    <BasicActionsTable></BasicActionsTable>
    <h2>Usable Weapons</h2>
    <ItemTable
      :items="useableWeapons"
      :hide-count="true"
      item-label="Weapons"
    ></ItemTable>
    <div class="mb-128"></div>
  </PageLayout>
</template>

<script setup lang="ts">
import ItemTable from "@/components/Items/ItemTable.vue";
import CombatTimeButtons from "@/components/Combat/CombatTimeButtons.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { computed } from "vue";
import BasicActionsTable from "@/components/Combat/BasicActions/BasicActionsTable.vue";
import DamageCalculatorLink from "@/components/Entities/DamageCalculator/DamageCalculatorLink.vue";

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();
jsonStorage.fetchWeaponTypes();

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
