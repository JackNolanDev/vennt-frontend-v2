<template>
  <CampaignChat
    :entity-id="entityStore.canEdit ? entityStore.entity?.entity.id : undefined"
  ></CampaignChat>
</template>

<script setup lang="ts">
import CampaignChat from "@/components/Campaign/Chat/CampaignChat.vue";
import { useEntityStore } from "@/stores/entity";

const entityStore = useEntityStore();
</script>
