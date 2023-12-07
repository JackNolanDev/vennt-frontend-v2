<template>
  <BaseLayout class="nav">
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout class="medium">
      <h1 class="centeredText">COG CREATION</h1>
      <BaseButton
        :to="{ name: CREATE_NEW_COG_ROUTE, query: $route.query }"
        class="primary bold center mb-8"
      >
        Make a new cog!
      </BaseButton>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import { CREATE_NEW_COG_ROUTE } from "@/router";
</script>
