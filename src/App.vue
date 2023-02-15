<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAccountInfoStore } from "./stores/accountInfo";

const accountInfoStore = useAccountInfoStore();
accountInfoStore.loadAccountInfo();
</script>
