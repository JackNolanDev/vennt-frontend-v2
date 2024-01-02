<template>
  <div class="alignRow split">
    <h2>Grievous Wounds</h2>
    <EntityAddGrievousWoundModal></EntityAddGrievousWoundModal>
  </div>
  <p v-if="grievousWoundsAbilities.length === 0" class="m-0">
    {{ entityStore.entity?.entity.name }} doesn't have any grievous wounds!
  </p>
  <AbilityTable
    v-else
    :abilities="grievousWoundsAbilities"
    :attrs="entityStore.computedAttributes"
    hide-activation
  ></AbilityTable>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import AbilityTable from "../Abilities/AbilityTable.vue";
import EntityAddGrievousWoundModal from "./EntityAddGrievousWoundModal.vue";
import { computed } from "vue";

const entityStore = useEntityStore();

const grievousWoundsAbilities = computed(() =>
  entityStore.sortedAbilities.filter(
    (ability) => ability.custom_fields?.path === "Grievous Wound",
  ),
);
</script>
