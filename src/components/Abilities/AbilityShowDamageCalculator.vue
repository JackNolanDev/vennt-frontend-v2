<template>
  <DamageCalculatorLink
    v-if="HANDLED_ABILITIES.includes(ability.name)"
    class="mt-8"
  ></DamageCalculatorLink>
</template>

<script setup lang="ts">
import type { EntityAbility } from "vennt-library";
import DamageCalculatorLink from "../Entities/DamageCalculatorLink.vue";

defineProps<{ ability: EntityAbility }>();

const HANDLED_ABILITIES = [
  "Dodge",
  "Block",
  "Shield Block",
  "Improved Shield Block",
];
</script>
