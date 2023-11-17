<template>
  <div v-if="campaignStore.chat" class="chat-wrapper">
    <div
      v-if="campaignStore.chat.length > 0"
      class="chat-messages"
      id="campaign-chat-messages"
    >
      <CampaignChatMessage
        v-for="(msg, idx) in campaignStore.chat"
        :key="msg.id"
        :msg="msg"
        :hide-header="hideChatHeader(idx)"
        class="mb-16"
      ></CampaignChatMessage>
      <div
        v-if="campaignStore.chatCursor"
        class="chat-loading"
        id="campaign-chat-loading"
      >
        <BaseSpinner></BaseSpinner>
      </div>
    </div>
    <div class="mt-16 chat-messages" v-else>No chat messages sent yet...</div>
    <NewCampaignChatForm
      v-if="campaignStore.role !== 'SPECTATOR'"
    ></NewCampaignChatForm>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import { onMounted, onUnmounted, watch } from "vue";
import BaseSpinner from "../Base/BaseSpinner.vue";
import CampaignChatMessage from "./CampaignChatMessage.vue";
import NewCampaignChatForm from "./NewCampaignChatForm.vue";

const campaignStore = useCampaignStore();

let observer: IntersectionObserver | null = null;
let spinnerElement: HTMLElement | null = null;

watch(
  () => campaignStore.chatCursor,
  () => {
    if (!campaignStore.chatCursor && spinnerElement) {
      observer?.unobserve(spinnerElement);
      spinnerElement = null;
    }
    setTimeout(() => {
      spinnerElement = document.getElementById("campaign-chat-loading");
      if (spinnerElement) {
        observer?.observe(spinnerElement);
      }
    }, 50);
  },
);

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry || !entry.isIntersecting) {
        return;
      }
      campaignStore.requestOlderMessages();
    },
    {
      root: document.getElementById("campaign-chat-messages"),
      rootMargin: "0px",
      threshold: 0.5,
    },
  );

  spinnerElement = document.getElementById("campaign-chat-loading");
  if (campaignStore.chatCursor && spinnerElement) {
    observer.observe(spinnerElement);
  }
});

const FIVE_MINS = 1000 * 60 * 5;

const hideChatHeader = (idx: number) => {
  if (!campaignStore.chat || idx >= campaignStore.chat.length - 1) {
    return false;
  }

  const current = campaignStore.chat[idx];
  const previous = campaignStore.chat[idx + 1];
  return (
    current.sender === previous.sender &&
    new Date(current.time).getTime() - new Date(previous.time).getTime() <=
      FIVE_MINS &&
    !current.for &&
    !previous.for &&
    !current.updated
  );
};

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: calc(100% - 32px);
}
.chat-messages {
  flex-grow: 1;
  flex-shrink: 1;
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
}
.chat-loading {
  min-height: 80px;
  display: grid;
  justify-items: center;
  align-items: center;
}
</style>
