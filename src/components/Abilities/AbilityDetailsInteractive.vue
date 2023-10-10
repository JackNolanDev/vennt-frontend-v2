<template>
  <UseAbilitySection :ability="ability"></UseAbilitySection>
  <AbilityUses :ability="ability"></AbilityUses>
  <AbilityShowDamageCalculator :ability="ability"></AbilityShowDamageCalculator>
  <AbilityComment :ability="ability"></AbilityComment>
  <div class="separator mt-16 mb-24"></div>
  <div class="cols-2">
    <StarAbilityButton :ability="ability"></StarAbilityButton>
    <HighlightAbilityButton :ability="ability"></HighlightAbilityButton>
  </div>
  <AbilityRepeatableSection :ability="ability"></AbilityRepeatableSection>
  <BaseButton @click="emit('editButton')" icon="edit" class="wide">
    Edit Ability
  </BaseButton>
  <DeleteAbilityButton :ability="ability"></DeleteAbilityButton>
  <AbilityUseLatestButton :ability="ability"></AbilityUseLatestButton>
</template>

<script setup lang="ts">
import AbilityComment from "./AbilityComment.vue";
import type { FullEntityAbility } from "@/utils/backendTypes";
import UseAbilitySection from "./UseAbilitySection.vue";
import AbilityUses from "../Uses/AbilityUses.vue";
import AbilityUseLatestButton from "./AbilityUseLatestButton.vue";
import DeleteAbilityButton from "./DeleteAbilityButton.vue";
import BaseButton from "../Base/BaseButton.vue";
import AbilityRepeatableSection from "./AbilityRepeatableSection.vue";
import AbilityShowDamageCalculator from "./AbilityShowDamageCalculator.vue";
import StarAbilityButton from "./StarAbilityButton.vue";
import HighlightAbilityButton from "./HighlightAbilityButton.vue";

defineProps<{ ability: FullEntityAbility }>();
const emit = defineEmits<{ (e: "editButton"): void }>();
</script>
