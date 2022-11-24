<template>
  <PageLayout>
    <h3>Your Characters</h3>
    <BaseButton :to="{ name: CREATE_ROUTE }" :bullet="true">
      Create or Import a new character
    </BaseButton>
    <h3>Your Campaigns</h3>
    <h3>Your Cogs</h3>
  </PageLayout>
</template>

<script setup lang="ts">
import { CREATE_ROUTE } from "@/router";
import BaseButton from "../Base/BaseButton.vue";
import PageLayout from "../Base/PageLayout.vue";
</script>
