<template>
  <form>
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
  </form>
</template>

<script setup lang="ts">
import { useCampaignStore } from "@/stores/campaign";
import BaseInlineTextEditor from "../../Base/BaseInlineTextEditor.vue";
import { reactive } from "vue";
import BaseButton from "../../Base/BaseButton.vue";
import { editorEmpty } from "@/utils/textUtils";

const props = defineProps<{ entityId?: string }>();
const campaignStore = useCampaignStore();
const state = reactive({ newMessage: "" });

const sendNewMessage = () => {
  campaignStore.sendChatMessage(state.newMessage, props.entityId);
  state.newMessage = "";
};
</script>
