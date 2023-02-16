<template>
  <BaseLayout class="nav">
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout class="medium">
      <h1 class="text-center">NOT FOUND</h1>
      <BaseButton :to="{ name: HOME_ROUTE }" class="primary wide center bolder"
        >Go Home</BaseButton
      >
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseLayout from "@/components/Base/BaseLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import { HOME_ROUTE } from "@/router";
</script>
