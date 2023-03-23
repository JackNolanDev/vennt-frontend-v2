<template>
  <PageLayout>
    <h3>Your Characters</h3>
    <BaseButton
      v-for="(character, idx) in entityListStore.characters"
      :key="idx"
      :to="{ name: ENTITY_ROUTE, params: { id: character.id } }"
    >
      <template #customIcon>
        <BulletPoint :entity="character"></BulletPoint>
      </template>
      {{ character.name }} - Level: {{ xp2Level(character.attributes.xp) }}
    </BaseButton>
    <BaseButton :to="{ name: CREATE_ROUTE }">
      <template #customIcon><BulletPoint></BulletPoint></template>
      Create or Import a new character
    </BaseButton>
    <h3>Your Campaigns</h3>
    <h3>Your Cogs</h3>
    <BaseButton
      v-for="(cog, idx) in entityListStore.cogs"
      :key="idx"
      :to="{ name: ENTITY_ROUTE, params: { id: cog.id } }"
    >
      <template #customIcon>
        <BulletPoint :entity="cog"></BulletPoint>
      </template>
      {{ cog.name }} - Level: {{ cog.attributes.L }}
    </BaseButton>
    <BaseButton :to="{ name: CREATE_COG_ROUTE }">
      <template #customIcon><BulletPoint></BulletPoint></template>
      Create a new Cog
    </BaseButton>
  </PageLayout>
</template>

<script setup lang="ts">
import { CREATE_COG_ROUTE, CREATE_ROUTE, ENTITY_ROUTE } from "@/router";
import { useEntityListStore } from "@/stores/entityList";
import BaseButton from "../Base/BaseButton.vue";
import PageLayout from "../Base/PageLayout.vue";
import { xp2Level } from "@/utils/attributeUtils";
import { onBeforeMount } from "vue";
import BulletPoint from "../Base/BulletPoint.vue";

const entityListStore = useEntityListStore();
onBeforeMount(() => {
  entityListStore.fetchEntities();
});
</script>
