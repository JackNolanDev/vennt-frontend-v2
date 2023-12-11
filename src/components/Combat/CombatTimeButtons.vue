<template>
  <div v-if="entityStore.inCombat" class="alignRow wide mb-16 time-buttons">
    <StartRoundButton></StartRoundButton>
    <StartTurnButton></StartTurnButton>
    <ToggleCombatButton></ToggleCombatButton>
  </div>
  <div v-else class="alignRow wide mb-16 time-buttons">
    <ToggleCombatButton></ToggleCombatButton>
    <BaseButton
      @click="handleEndTimePeriod('encounter')"
      icon="curtains"
      class="wide"
      >End Scene</BaseButton
    >
    <EntityRestModal></EntityRestModal>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import BaseButton from "../Base/BaseButton.vue";
import { handleEndTimePeriod } from "@/utils/combatUtils";
import EntityRestModal from "./EntityRestModal.vue";
import ToggleCombatButton from "./ToggleCombatButton.vue";
import StartRoundButton from "./StartRoundButton.vue";
import StartTurnButton from "./StartTurnButton.vue";

const entityStore = useEntityStore();
</script>

<style scoped>
@container page (max-width: 600px) {
  .time-buttons {
    flex-direction: column;
  }
}
</style>
