<template>
  <div class="panel ml-16 mr-16 mb-64">
    <div class="centeredText">
      <h2>{{ entity.entity.name }}</h2>
    </div>
    <div class="seperator"></div>
    <!-- COMBAT STATS -->
    <div class="alignRow">
      <BulletPointVue :entity="entity.entity"></BulletPointVue>
      <h2>Combat Stats</h2>
    </div>
    <!-- ATTRIBUTES -->
    <div class="alignRow">
      <BulletPointVue :entity="entity.entity"></BulletPointVue>
      <h2>Attributes</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CollectedEntity } from "@/utils/backendTypes";
import BulletPointVue from "./BulletPoint.vue";

defineProps<{ entity: CollectedEntity }>();
</script>

<style scoped>
/* Mobile Styles */
@media screen and (max-width: 396px) {
  .panel {
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>
