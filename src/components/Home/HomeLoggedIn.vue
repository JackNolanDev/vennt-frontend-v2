<template>
  <PageLayout>
    <h3>Your Characters</h3>
    <BaseButton
      v-for="(character, idx) in entityListStore.characters"
      :key="idx"
      :to="{ name: ENTITY_ROUTE, params: { id: character.id } }"
      :bullet="character"
    >
      {{ character.name }} - Level: {{ xp2Level(character.attributes.xp) }}
    </BaseButton>
    <BaseButton :to="{ name: CREATE_ROUTE }" :bullet="true">
      Create or Import a new character
    </BaseButton>
    <h3>Your Campaigns</h3>
    <h3>Your Cogs</h3>
  </PageLayout>
</template>

<script setup lang="ts">
import { CREATE_ROUTE, ENTITY_ROUTE } from "@/router";
import { useEntityListStore } from "@/stores/entityList";
import BaseButton from "../Base/BaseButton.vue";
import PageLayout from "../Base/PageLayout.vue";
import { xp2Level } from "@/utils/attributeUtils";
import { onBeforeMount } from "vue";

const entityListStore = useEntityListStore();
onBeforeMount(() => {
  entityListStore.fetchEntities();
});
</script>
