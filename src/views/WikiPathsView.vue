<template>
  <BaseLayout class="nav">
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout>
      <h1>List of Paths</h1>
      <WikiMenu :tree="jsonStorage.pathMap"></WikiMenu>
      <div class="mb-256"></div>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import WikiMenu from "@/components/Wiki/WikiMenu.vue";
import { useJsonStore } from "@/stores/jsonStorage";

const jsonStorage = useJsonStore();
jsonStorage.fetchAbilities();
</script>
