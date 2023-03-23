<template>
  <div class="alignRow">
    <BulletPoint :entity="entity.entity"></BulletPoint>
    <h2>Abilities</h2>
  </div>
  <div
    v-for="(ability, index) in entity.abilities"
    v-bind:key="index"
    class="card column padded mb-8"
  >
    <h3 class="mt-0 mb-0">{{ ability.name }}</h3>
    <DisplayAbilityFull :ability="ability" :attrs="attrs"></DisplayAbilityFull>
  </div>
</template>

<script setup lang="ts">
import type {
  CollectedEntity,
  UpdatedEntityAttributes,
} from "@/utils/backendTypes";
import DisplayAbilityFull from "../Abilities/DisplayAbilityFull.vue";
import BulletPoint from "../Base/BulletPoint.vue";

defineProps<{ entity: CollectedEntity; attrs?: UpdatedEntityAttributes }>();
</script>
