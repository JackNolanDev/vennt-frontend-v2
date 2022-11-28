<template>
  <div class="basicBtnContents">
    <BulletPoint
      v-if="bullet"
      :entity="bullet === true ? undefined : bullet"
    ></BulletPoint>
    <span v-else-if="icon" class="material-icons space">
      {{ icon }}
    </span>
    <span class="nowrap alignRow text-contents">
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Entity } from "@/utils/backendTypes";
import BulletPoint from "./BulletPoint.vue";

defineProps<{ icon?: string; bullet?: Entity | true }>();
</script>

<style scoped>
.selected .material-icons {
  color: var(--main-button);
}
.selected.basicBtn:disabled .material-icons {
  color: var(--basic-button-disabled);
}

.basicBtnContents:has(> .text-contents:empty) > .space {
  margin-right: 0px;
}
</style>
