<template>
  <div>
    <div v-if="campaignStore.chat && campaignStore.chat.length > 0">
      <div v-for="msg in campaignStore.chat" :key="msg.id" class="mt-16">
        <div class="alignRow">
          <strong>{{ msgSender(msg) }}</strong>
        </div>
        <div
          v-html="renderMarkdown(msg.message)"
          class="condense-child-text"
        ></div>
      </div>
    </div>
    <div class="mt-16" v-else>No chat messages sent yet...</div>
    <div class="separator mt-16 mb-16"></div>
    <BaseInlineTextEditor
      v-model="state.newMessage"
      placeholder="Chat"
    ></BaseInlineTextEditor>
    <div class="alignRow end mt-8">
      <BaseButton
        @click="sendNewMessage"
        :disabled="editorEmpty(state.newMessage)"
        icon="send"
        class="primary"
        >Send</BaseButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import BaseInlineTextEditor from "../Base/BaseInlineTextEditor.vue";
import { reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import { editorEmpty, renderMarkdown } from "@/utils/textUtils";
import type { ChatMessage } from "vennt-library";

const campaignStore = useCampaignStore();
const state = reactive({ newMessage: "" });

const msgSender = (msg: ChatMessage): string => {
  const entityName = campaignStore.details?.entities.find(
    (entity) => entity.entity_id === msg.entity,
  )?.name;
  const sender = campaignStore.details?.members.find(
    (member) => member.account_id === msg.sender,
  )?.username;
  if (entityName && sender) {
    return `${entityName} (${sender})`;
  }
  return entityName ?? sender ?? "Sender";
};

const sendNewMessage = () => {
  campaignStore.sendChatMessage(state.newMessage);
  state.newMessage = "";
};
</script>
