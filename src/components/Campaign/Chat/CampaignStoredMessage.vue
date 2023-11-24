<template>
  <CampaignChatMessage
    v-if="msg.type === CHAT_TYPE"
    :msg="msg"
    :hide-header="hideHeader"
  ></CampaignChatMessage>
  <DiceRollResultMessage
    v-else-if="msg.type === DICE_ROLL_RESULT_TYPE"
    :msg="msg"
    :hide-header="hideHeader"
  ></DiceRollResultMessage>
</template>

<script setup lang="ts">
import {
  CHAT_TYPE,
  DICE_ROLL_RESULT_TYPE,
  type StoredMessage,
} from "vennt-library";
import CampaignChatMessage from "./CampaignChatMessage.vue";
import DiceRollResultMessage from "./DiceRollResultMessage.vue";

defineProps<{ msg: StoredMessage; hideHeader: boolean }>();
</script>
