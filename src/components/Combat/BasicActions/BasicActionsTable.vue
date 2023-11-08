<template>
  <AbilityTable
    :abilities="BASIC_ACTIONS"
    :attrs="entityStore.computedAttributes"
  ></AbilityTable>
</template>

<script setup lang="ts">
import AbilityTable from "../../Abilities/AbilityTable.vue";
import { useEntityStore } from "@/stores/entity";
import { BASIC_ACTIONS } from "@/utils/copy/basicActionsCopy";

const entityStore = useEntityStore();
</script>
