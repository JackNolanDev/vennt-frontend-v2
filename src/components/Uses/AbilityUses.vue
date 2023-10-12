<template>
  <AbilityInputsUse
    v-if="ability.uses?.inputs"
    :ability="ability"
    :inputs="ability.uses.inputs"
  ></AbilityInputsUse>
  <AbilityOptionalHealUse
    v-if="ability.uses?.optional_heal"
    :ability="ability"
  ></AbilityOptionalHealUse>
  <AbilityWeaponsUse
    v-if="ability.uses?.weapons"
    :ability="ability"
  ></AbilityWeaponsUse>
  <AbilityRollUse v-if="ability.uses?.roll" :ability="ability"></AbilityRollUse>
  <CheckUse
    v-if="ability.uses?.check"
    :use="ability.uses.check"
    :name="ability.name"
  ></CheckUse>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import AbilityInputsUse from "./AbilityInputsUse.vue";
import AbilityRollUse from "./AbilityRollUse.vue";
import AbilityWeaponsUse from "./AbilityWeaponsUse.vue";
import CheckUse from "./CheckUse.vue";
import AbilityOptionalHealUse from "./AbilityOptionalHealUse.vue";

defineProps<{ ability: FullEntityAbility }>();
</script>
