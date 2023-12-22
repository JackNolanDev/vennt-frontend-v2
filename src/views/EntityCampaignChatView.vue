<template>
  <PageLayout>
    <CampaignChat
      :entity-id="
        entityStore.canEdit ? entityStore.entity?.entity.id : undefined
      "
    ></CampaignChat>
  </PageLayout>
</template>

<script setup lang="ts">
import CampaignChat from "@/components/Campaign/Chat/CampaignChat.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import { useEntityStore } from "@/stores/entity";

const entityStore = useEntityStore();
</script>
