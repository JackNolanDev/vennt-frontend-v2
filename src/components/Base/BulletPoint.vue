<template>
  <div v-bind:style="{ 'background-color': charColor }" class="bullet"></div>
</template>

<script setup lang="ts">
import type { CampaignEntity, Entity } from "vennt-library";
import { entityColor } from "@/utils/entityUtils";
import { computed } from "vue";

const props = defineProps<{ entity?: Entity | CampaignEntity }>();
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
