<template>
  <div
    v-if="entityStore.computedAttributes.xp"
    class="alignRow labelText mb-16"
  >
    Spent XP:
    <BaseFraction
      :top="entityStore.spentXP"
      :bottom="entityStore.computedAttributes.xp.val"
      class="ml-16"
    ></BaseFraction>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import BaseFraction from "../Base/BaseFraction.vue";

const entityStore = useEntityStore();
</script>
