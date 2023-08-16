<template>
  <AbilityTable
    :abilities="BASIC_ACTIONS"
    :attrs="entityStore.entityAttributes"
  ></AbilityTable>
</template>

<script setup lang="ts">
import AbilityTable from "../../Abilities/AbilityTable.vue";
import { useEntityStore } from "@/stores/entity";
import { BASIC_ACTIONS } from "@/utils/copy/basicActionsCopy";

const entityStore = useEntityStore();
</script>
