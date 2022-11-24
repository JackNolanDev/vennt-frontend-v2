<template>
  <BaseLayout>
    <template #nav><BaseNav></BaseNav></template>
    <HomeLoggedIn v-if="accountInfoStore.isLoggedIn"></HomeLoggedIn>
    <HomeLoggedOut v-else></HomeLoggedOut>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import HomeLoggedIn from "@/components/Home/HomeLoggedIn.vue";
import HomeLoggedOut from "@/components/Home/HomeLoggedOut.vue";
import BaseNav from "@/components/Nav/BaseNav.vue";
import { useAccountInfoStore } from "@/stores/accountInfo";

const accountInfoStore = useAccountInfoStore();
</script>
