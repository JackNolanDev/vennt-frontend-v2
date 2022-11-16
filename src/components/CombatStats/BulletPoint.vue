<template>
  <div v-bind:style="{ 'background-color': charColor }" class="bullet"></div>
</template>

<script setup lang="ts">
import type { Entity } from "@/utils/backendTypes";
import { entityColor } from "@/utils/entityUtils";
import { computed } from "vue";

const props = defineProps<{ entity: Entity }>();
const charColor = computed(() => {
  return entityColor(props.entity);
});
</script>

<style scoped>
.bullet {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin-right: 8px;
}
</style>
