<template>
  <BaseButton
    @click="toggleFavorite"
    icon="star"
    class="wide"
    :class="{ 'no-fill': ability.custom_fields?.stars }"
    >{{ ability.custom_fields?.stars ? "Unfavorite" : "Favorite" }}
  </BaseButton>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import type { FullEntityAbility } from "@/utils/backendTypes";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{ ability: FullEntityAbility }>();
const entityStore = useEntityStore();

const toggleFavorite = () => {
  const currentStars = props.ability.custom_fields?.stars;
  const newStars = !currentStars || currentStars === 0 ? 1 : 0;
  const newCustomFields = { ...props.ability.custom_fields, stars: newStars };
  entityStore.updateAbility(props.ability.id, {
    custom_fields: newCustomFields,
  });
};
</script>
