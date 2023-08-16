<template>
  <h2>Attack</h2>
  <p>
    Attacking is one of the Basic Actions available to all characters. When you
    make an attack as a Basic Action, it is called a
    <strong>basic attack</strong>, as compared to a skill strike. Some abilities
    also let you make a basic attack as part of the ability action.
  </p>
  <p>
    Declaring a melee or ranged attack costs <strong>2 Actions</strong>. You
    must have a line of sight to your target to attempt an attack.
  </p>
  <SimpleItemTable
    :items="useableWeapons"
    :link-on-name="true"
    title="Usable / Equipped Weapons"
  ></SimpleItemTable>
</template>

<script setup lang="ts">
import SimpleItemTable from "@/components/Items/SimpleItemTable.vue";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { computed } from "vue";

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

// TODO: Instead of copying this code from combat, should move logic into util file, probably
const useableWeapons = computed(() =>
  entityStore.consolidatedItems
    .filter(
      (item) =>
        !item.custom_fields?.in_storage &&
        item.type === "weapon" &&
        (item.active || item.custom_fields?.category === "Grenade")
    )
    .concat(jsonStorage.defaultWeapons)
);
</script>
