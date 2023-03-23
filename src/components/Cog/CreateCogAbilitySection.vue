<template>
  <div>
    <div class="stickyHeader thin">
      <div class="alignRow labelText">
        Remaining AP:
        <BaseFraction
          :top="cogCreateStore.remainingAP"
          :bottom="cogCreateStore.totalAP"
          class="ml-16"
        ></BaseFraction>
      </div>
    </div>
    <div v-for="section in cogAbilityOptions" :key="section.section">
      <h3>{{ section.section }}</h3>
      <div
        v-for="category in section.categories"
        :key="category.name"
        class="card column padded mt-8"
      >
        <CreateCogAbilityCategory
          :category="category"
        ></CreateCogAbilityCategory>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCogCreateStore } from "@/stores/cogCreate";
import { cogAbilityOptions } from "@/utils/copy/createCogAbilityOptions";
import BaseFraction from "../Base/BaseFraction.vue";
import CreateCogAbilityCategory from "./CreateCogAbilityCategory.vue";

const cogCreateStore = useCogCreateStore();
</script>
