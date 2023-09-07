<template>
  <BaseButton
    v-if="HANDLED_ABILITIES.includes(ability.name)"
    :to="{ params: { detail: 'damage' }, query: $route.query }"
    icon="calculate"
    class="wide mt-8"
    >Damage Calculator</BaseButton
  >
</template>

<script setup lang="ts">
import type { EntityAbility } from "@/utils/backendTypes";
import BaseButton from "../Base/BaseButton.vue";

defineProps<{ ability: EntityAbility }>();

const HANDLED_ABILITIES = [
  "Dodge",
  "Block",
  "Shield Block",
  "Improved Shield Block",
];
</script>
