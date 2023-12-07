<template>
  <BaseLayout class="nav">
    <template #nav><WikiNav></WikiNav></template>
    <PageLayout>
      <h1 class="center-text">Wiki</h1>
      <BaseButton :to="{ name: WIKI_PATHS_ROUTE }" class="primary center"
        >Abilities Wiki</BaseButton
      >
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseLayout from "@/components/Base/BaseLayout.vue";
import WikiNav from "@/components/Wiki/WikiNav.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import { WIKI_PATHS_ROUTE } from "@/router";
</script>
