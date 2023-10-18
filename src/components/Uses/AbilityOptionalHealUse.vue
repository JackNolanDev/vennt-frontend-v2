<template>
  <UseAbilityButton
    v-for="(_, idx) in ability.uses?.optional_heal"
    :key="idx"
    :ability="ability"
    :optional-heal-idx="idx"
  ></UseAbilityButton>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import UseAbilityButton from "../Abilities/UseAbilityButton.vue";

defineProps<{ ability: FullEntityAbility }>();
</script>
