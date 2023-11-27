<template>
  <CampaignChat :entity-id="entityStore.entity?.entity.id"></CampaignChat>
</template>

<script setup lang="ts">
import CampaignChat from "@/components/Campaign/Chat/CampaignChat.vue";
import { useEntityStore } from "@/stores/entity";

const entityStore = useEntityStore();
</script>
