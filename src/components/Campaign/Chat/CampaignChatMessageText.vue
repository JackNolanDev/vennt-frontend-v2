<template>
  <div>
    <div v-if="!hideHeader" class="alignRow gap baseline mb-4">
      <strong
        ><RouterLink
          v-if="msg.entity"
          :to="{
            name: ENTITY_ROUTE,
            params: { id: msg.entity },
            query: { campaign: campaignStore.details?.campaign.id },
          }"
          class="stealth"
          >{{ entityName }}</RouterLink
        >
        {{ sender }}</strong
      >
      <span class="pt-10 muted-text ellipsis no-wrap">{{
        new Date(msg.time).toLocaleTimeString()
      }}</span>
    </div>
    <div
      v-if="msg.message"
      v-html="renderMarkdown(msg.message)"
      class="condense-child-text"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ENTITY_ROUTE } from "@/router";
import { useCampaignStore } from "@/stores/campaign";
import { renderMarkdown } from "@/utils/textUtils";
import type { StoredMessage } from "vennt-library";
import { computed } from "vue";

const props = defineProps<{ msg: StoredMessage; hideHeader?: boolean }>();
const campaignStore = useCampaignStore();

const entityName = computed(
  () =>
    campaignStore.details?.entities.find(
      (entity) => entity.entity_id === props.msg.entity,
    )?.name,
);

const sender = computed(() => {
  const sender = campaignStore.details?.members.find(
    (member) => member.account_id === props.msg.sender,
  )?.username;
  if (entityName.value && sender) {
    return `(${sender})`;
  }
  return sender ?? "Sender";
});
</script>
