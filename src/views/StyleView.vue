<template>
  <BaseLayout :class="showSection('prefers-sidebar') ? 'prefers-sidebar' : ''">
    <template #nav v-if="showSection('nav')">
      <div class="nav fill-parent">vennt nav</div>
    </template>
    <template #sub-nav v-if="showSection('sub-nav')">
      <div class="sub-nav fill-parent">vennt subnav</div>
    </template>
    <template #sidebar v-if="showSection('sidebar')">
      <div class="sidebar fill-parent">vennt sidebar</div>
    </template>
    <template #sidebar-right v-if="showSection('sidebar-right')">
      <div class="sidebar-right fill-parent">vennt sidebar right</div>
    </template>
    <div>
      <h1>Main content</h1>
      <BaseCheckBoxArray
        :checked="state.checked"
        :options="checkBoxOptions"
      ></BaseCheckBoxArray>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseCheckBoxArray from "@/components/Base/BaseCheckBoxArray.vue";
import BaseLayout from "@/components/Base/BaseLayout.vue";
import { reactive } from "vue";

const state = reactive({ checked: new Set<string>() });

const showSection = (section: string) => {
  return state.checked.has(section);
};

const checkBoxOptions = {
  nav: "Show nav",
  "sub-nav": "show subnav",
  sidebar: "show left sidebar",
  "sidebar-right": "show right sidebar",
  "prefers-sidebar": "Prefers sidebar",
};
</script>

<style scoped>
.fill-parent {
  width: 100%;
  height: 100%;
}
.nav {
  background-color: chocolate;
}
.sub-nav {
  background-color: orangered;
}
.sidebar {
  background-color: green;
}
.sidebar-right {
  background-color: darkviolet;
}
</style>
