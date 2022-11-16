<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAccountInfoStore } from "./stores/accountInfo";

const accountInfoStore = useAccountInfoStore();
accountInfoStore.fetchCurrentAccount();

/*
MODAL example
.backdrop {
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    margin: 0;
    background: rgba(0, 0, 0, 0.66);
}
.window {
    font-family: var(--monospace);
    line-height: 1.5;
    width: 800px;
    color: var(--window-color);
    margin: 30px auto;
    padding: 25px 40px;
    position: relative;
    background: var(--window-background);
    border-radius: 6px 6px 8px 8px;
    box-shadow: 0 19px 38px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    overflow: hidden;
    border-top: 8px solid var(--red);
    direction: ltr;
    text-align: left;
}
*/
</script>
