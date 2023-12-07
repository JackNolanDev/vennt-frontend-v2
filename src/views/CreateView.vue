<template>
  <BaseLayout class="nav">
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout class="medium">
      <h1 class="centeredText">CHARACTER CREATION</h1>
      <p>
        You can create a totally new character or import a character which you
        have already created.
      </p>
      <BaseButton
        :to="{ name: CREATE_NEW_ROUTE, query: $route.query }"
        class="primary bold center mb-8"
      >
        Make a new character!
      </BaseButton>
      <BaseButton
        :to="{ name: CREATE_UPLOAD_ROUTE, query: $route.query }"
        class="primary bold center mb-8"
      >
        Upload an entity
      </BaseButton>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import { CREATE_NEW_ROUTE, CREATE_UPLOAD_ROUTE } from "@/router";
</script>
