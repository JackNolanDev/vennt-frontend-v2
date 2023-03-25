<template>
  <div v-if="entityStore.entity">
    <h1>{{ entityStore.entity.entity.name }}</h1>
    <EntityDescription></EntityDescription>
    <EntityBackstory></EntityBackstory>
    <div v-if="entityStore.entity.entity.type === 'CHARACTER'">
      <div class="separator mt-16 mb-16"></div>
      <EntityFlux></EntityFlux>
    </div>
  </div>
</template>

<script setup lang="ts">
import EntityBackstory from "@/components/Entities/EntityBackstory.vue";
import EntityDescription from "@/components/Entities/EntityDescription.vue";
import EntityFlux from "@/components/Entities/EntityFlux.vue";
import { useEntityStore } from "@/stores/entity";

const entityStore = useEntityStore();
</script>
