<template>
  <div class="basicBtnContents">
    <BulletPoint
      v-if="bullet"
      :entity="bullet === true ? undefined : bullet"
    ></BulletPoint>
    <span v-else-if="icon" class="material-icons space">
      {{ icon }}
    </span>
    <span class="nowrap alignRow">
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Entity } from "@/utils/backendTypes";
import BulletPoint from "./BulletPoint.vue";

defineProps<{ icon?: string; bullet?: Entity | true }>();
</script>
