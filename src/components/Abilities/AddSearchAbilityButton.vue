<template>
  <BaseButton @click="addAbility" icon="add" class="primary wide mt-24">
    Add ability
  </BaseButton>
</template>

<script setup lang="ts">
import type { UncompleteEntityAbility } from "vennt-library";
import BaseButton from "../Base/BaseButton.vue";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ ability: UncompleteEntityAbility }>();
const entityStore = useEntityStore();

const addAbility = () => {
  entityStore.addAbilities([{ ...props.ability }], true);
};
</script>
