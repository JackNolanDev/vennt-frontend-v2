<template>
  <BaseButton
    v-if="updatedAbility"
    @click="updateAbility"
    icon="refresh"
    title="Updates this ability to use the latest version on the wiki"
    class="wide"
    >Use latest version</BaseButton
  >
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { findNewAbilityVersion } from "@/utils/abilityUtils";
import type { FullEntityAbility } from "@/utils/backendTypes";
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{ ability: FullEntityAbility }>();
const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

const updatedAbility = computed(() =>
  findNewAbilityVersion(props.ability, jsonStorage.abilities)
);

const updateAbility = () => {
  // console.log({ old: props.ability, new: updatedAbility.value });
  if (updatedAbility.value) {
    entityStore.updateAbility(props.ability.id, updatedAbility.value);
  }
};
</script>
