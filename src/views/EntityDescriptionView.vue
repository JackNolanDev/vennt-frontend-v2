<template>
  <PageLayout>
    <div v-if="entityStore.entity" class="mb-128">
      <h1>{{ entityStore.entity.entity.name }}</h1>
      <EntityDescription></EntityDescription>
      <EntityBackstory></EntityBackstory>
      <div v-if="entityStore.entity.entity.type === 'CHARACTER'">
        <div class="separator mt-16 mb-16"></div>
        <EntityFlux></EntityFlux>
      </div>
      <div class="separator mt-16 mb-16"></div>
      <EntityGrievousWounds></EntityGrievousWounds>
    </div>
    <div v-else class="alignRow center mt-64">
      <BaseSpinner></BaseSpinner>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import EntityBackstory from "@/components/Entities/EntityBackstory.vue";
import EntityDescription from "@/components/Entities/EntityDescription.vue";
import EntityFlux from "@/components/Entities/EntityFlux.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import { useEntityStore } from "@/stores/entity";
import EntityGrievousWounds from "@/components/Entities/EntityGrievousWounds.vue";
import BaseSpinner from "@/components/Base/BaseSpinner.vue";

const entityStore = useEntityStore();
</script>
