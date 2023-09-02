<template>
  <div class="alignRow split ml-16 mr-16">
    <h1 class="ml-16">Path Map</h1>
    <BaseCheckBox
      @click="state.showTree = !state.showTree"
      :checked="!state.showTree"
      :use-toggle="true"
      :highlight="true"
      >Show Graph Version</BaseCheckBox
    >
  </div>
  <div class="separator"></div>
  <WikiPathGraph
    v-if="jsonStorage.abilities.paths.length > 0"
    :show-tree="state.showTree"
  ></WikiPathGraph>
</template>

<script setup lang="ts">
import { useJsonStore } from "@/stores/jsonStorage";
import WikiPathGraph from "@/components/Wiki/WikiPathGraph.vue";
import BaseCheckBox from "@/components/Base/BaseCheckBox.vue";
import { reactive } from "vue";

const state = reactive({ showTree: true });
const jsonStorage = useJsonStore();
</script>
