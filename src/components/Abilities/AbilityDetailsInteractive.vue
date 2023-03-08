<template>
  <AbilityUses :ability="ability"></AbilityUses>
  <AbilityComment :ability="ability"></AbilityComment>
  <UseAbilitySection :ability="ability"></UseAbilitySection>
  <div class="separator mt-16 mb-16"></div>
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

defineProps<{ ability: FullEntityAbility }>();
</script>
