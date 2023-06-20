<template>
  <p
    v-if="
      ability.custom_fields?.mp_cost &&
      tripleDigitStr(ability.custom_fields.mp_cost)
    "
    class="mt-16 mb-0 text-block"
  >
    <b>MP Cost:</b> {{ tripleDigitStr(ability.custom_fields.mp_cost) }}
  </p>
  <p
    v-if="
      ability.custom_fields?.cast_dl &&
      tripleDigitStr(ability.custom_fields.cast_dl)
    "
    class="mt-16 mb-0 text-block"
  >
    <b>Casting DL:</b> {{ tripleDigitStr(ability.custom_fields.cast_dl) }}
  </p>
  <p v-if="ability.custom_fields?.build_dc" class="mt-16 mb-0 text-block">
    <b>Build DC:</b> {{ ability.custom_fields.build_dc }}
  </p>
  <div v-if="ability.custom_fields?.build_time" class="mt-16 mb-0 text-block">
    <b>Build Time:</b> {{ ability.custom_fields.build_time }}
  </div>
  <p v-if="ability.custom_fields?.activation" class="mt-16 mb-0 text-block">
    <b>Activation:</b> {{ ability.custom_fields.activation }}
  </p>
</template>

<script setup lang="ts">
import type { EntityAbility } from "@/utils/backendTypes";

defineProps<{ ability: EntityAbility }>();

const tripleDigitStr = (triple: number[]): string =>
  triple.length === 3 ? `[ ${triple[0]} / ${triple[1]} / ${triple[2]} ]` : "";
</script>
