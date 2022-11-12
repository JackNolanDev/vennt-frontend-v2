<template>
  <BaseLayout>
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout class="medium">
      <HomeLoggedOut></HomeLoggedOut>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import HomeLoggedOut from "@/components/Home/HomeLoggedOut.vue";
import BaseNav from "@/components/Nav/BaseNav.vue";
</script>
