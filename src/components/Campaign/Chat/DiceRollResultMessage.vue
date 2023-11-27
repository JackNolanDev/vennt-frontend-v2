<template>
  <div class="message">
    <CampaignChatMessageText
      :msg="msg"
      :hide-header="hideHeader"
      :class="{ 'mb-4': msg.message }"
    ></CampaignChatMessageText>
    <DiceRender :roll-result="JSON.parse(msg.result)"></DiceRender>
  </div>
</template>

<script setup lang="ts">
import type { DiceRollResult } from "vennt-library";
import CampaignChatMessageText from "./CampaignChatMessageText.vue";
import DiceRender from "@/components/Dice/DiceRender.vue";

defineProps<{ msg: DiceRollResult; hideHeader: boolean }>();
</script>
