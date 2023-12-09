<template>
  <div class="message" :class="{ sender: userIsSender }">
    <form v-if="state.editMessage" class="card column padded thin">
      <label class="label-text">Update Message</label>
      <BaseInlineTextEditor
        v-model="state.editedMessage"
        placeholder="Updated Chat Message"
      ></BaseInlineTextEditor>
      <div class="alignRow end gap mt-4">
        <BaseButton
          @click="cancelEditMessage"
          icon="close"
          class="secondary small-icon"
          >Cancel</BaseButton
        >
        <BaseButton
          @click="saveEditMessage"
          icon="save"
          class="primary small-icon"
          >Update</BaseButton
        >
      </div>
    </form>
    <CampaignChatMessageText
      v-else
      :hide-header="hideHeader"
      :msg="msg"
    ></CampaignChatMessageText>
    <BaseButton
      v-if="userIsSender && !state.optionsVisible && !state.editMessage"
      @click="showOptions"
      icon="more_horiz"
      class="show-on-hover tiny-icon"
    ></BaseButton>
    <div v-if="state.optionsVisible" class="card column border message-options">
      <BaseButton id="test" icon="edit" class="tiny-icon" @click="editMessage"
        >Edit</BaseButton
      >
      <ConfirmationModal
        @main-button="deleteMessage"
        :id="`delete-${msg.id}`"
        trigger-class="tiny-icon"
        trigger-icon="delete"
        trigger-button-id="delete-button"
      >
        <template #triggerButton>Delete</template>
        <template #title>Delete Message</template>
        <template #mainButton>Delete</template>
        Delete the following message? It will not recoverable!
        <CampaignChatMessageText
          :msg="msg"
          class="card column padded mt-16"
        ></CampaignChatMessageText>
      </ConfirmationModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountInfoStore } from "@/stores/accountInfo";
import { useCampaignStore } from "@/stores/campaign";
import type { ChatMessage } from "vennt-library";
import { computed, reactive } from "vue";
import BaseButton from "../../Base/BaseButton.vue";
import ConfirmationModal from "../../Base/ConfirmationModal.vue";
import CampaignChatMessageText from "./CampaignChatMessageText.vue";
import BaseInlineTextEditor from "../../Base/BaseInlineTextEditor.vue";

const state = reactive({
  optionsVisible: false,
  editMessage: false,
  editedMessage: "",
});
const props = defineProps<{ msg: ChatMessage; hideHeader: boolean }>();
const accountInfoStore = useAccountInfoStore();
const campaignStore = useCampaignStore();

const userIsSender = computed(() => {
  const user = accountInfoStore.accountInfo;
  return user && user.id === props.msg.sender;
});

const showOptions = () => {
  state.optionsVisible = true;
  setTimeout(() => {
    window.addEventListener("click", hideOptions);
  }, 50);
};

const hideOptions = () => {
  state.optionsVisible = false;
  window.removeEventListener("click", hideOptions);
};

const editMessage = () => {
  state.editMessage = true;
  state.editedMessage = props.msg.message;
};
const cancelEditMessage = () => {
  state.editMessage = false;
};
const saveEditMessage = () => {
  state.editMessage = false;
  campaignStore.updateChatMessage(props.msg.id, state.editedMessage);
};
const deleteMessage = () => {
  campaignStore.deleteChatMessage(props.msg.id);
};
</script>

<style scoped>
.message {
  position: relative;
}
.message.sender:hover {
  background-color: rgba(75, 74, 103, 0.2);
}
.show-on-hover {
  display: none;
  position: absolute;
  z-index: 2;
  right: 0;
  top: -10px;
}
.message:hover > .show-on-hover,
.show-on-hover:focus {
  display: grid;
  width: unset;
  height: unset;
}
.message-options {
  position: absolute;
  z-index: 2;
  right: 0;
  top: -64px;
}
</style>
