<template>
  <h2>Flux</h2>
  <EntityFluxList type="QUEST" class="mt-16"></EntityFluxList>
  <EntityFluxList type="TIDE" class="mt-16"></EntityFluxList>
  <EntityFluxList type="GRATE" class="mt-16"></EntityFluxList>
  <EntityFluxList type="DELTA" class="mt-16 mb-128"></EntityFluxList>
</template>

<script setup lang="ts">
import EntityFluxList from "./EntityFluxList.vue";
</script>
