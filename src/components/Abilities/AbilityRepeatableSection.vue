<template>
  <div v-if="ability.custom_fields?.repeatable">
    <p class="mb-16">
      <b>Times Taken:</b> {{ ability.custom_fields?.times_taken ?? 1 }}
    </p>
    <BaseButton @click="takeAgain" icon="add" class="wide"
      >Take Ability Again</BaseButton
    >
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import type { FullEntityAbility } from "vennt-library";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{ ability: FullEntityAbility }>();
const entityStore = useEntityStore();

const takeAgain = () => {
  entityStore.updateAbility(props.ability.id, {
    custom_fields: {
      ...props.ability.custom_fields,
      times_taken: (props.ability.custom_fields?.times_taken ?? 1) + 1,
    },
  });
};
</script>
