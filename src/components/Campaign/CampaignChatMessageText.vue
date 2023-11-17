<template>
  <div>
    <div v-if="!hideHeader" class="alignRow gap baseline mb-4">
      <strong>{{ sender }}</strong>
      <span class="pt-10 muted-text ellipsis no-wrap">{{
        new Date(msg.time).toLocaleString()
      }}</span>
    </div>
    <div v-html="renderMarkdown(msg.message)" class="condense-child-text"></div>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import { renderMarkdown } from "@/utils/textUtils";
import type { ChatMessage } from "vennt-library";
import { computed } from "vue";

const props = defineProps<{ msg: ChatMessage; hideHeader?: boolean }>();
const campaignStore = useCampaignStore();

const sender = computed(() => {
  const entityName = campaignStore.details?.entities.find(
    (entity) => entity.entity_id === props.msg.entity,
  )?.name;
  const sender = campaignStore.details?.members.find(
    (member) => member.account_id === props.msg.sender,
  )?.username;
  if (entityName && sender) {
    return `${entityName} (${sender})`;
  }
  return entityName ?? sender ?? "Sender";
});
</script>
