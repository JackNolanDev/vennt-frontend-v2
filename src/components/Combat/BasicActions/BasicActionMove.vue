<template>
  <h2>Move</h2>
  <DisplayAbilityFull
    :ability="BASIC_ACTION_MOVE"
    :attrs="entityStore.computedAttributes"
  ></DisplayAbilityFull>
  <UseAbilitySection
    v-if="entityStore.canEdit"
    :ability="BASIC_ACTION_MOVE"
  ></UseAbilitySection>
</template>

<script setup lang="ts">
import DisplayAbilityFull from "@/components/Abilities/DisplayAbilityFull.vue";
import UseAbilitySection from "@/components/Abilities/UseAbilitySection.vue";
import { useEntityStore } from "@/stores/entity";
import { BASIC_ACTION_MOVE } from "@/utils/copy/basicActionsCopy";

const entityStore = useEntityStore();
</script>
