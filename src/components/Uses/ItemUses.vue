<template>
  <ItemHealUse v-if="item.uses?.heal" :item="item"></ItemHealUse>
  <ItemRollUse v-if="item.uses?.roll" :item="item"></ItemRollUse>
  <CheckUse v-if="item.uses?.check" :use="item.uses.check"></CheckUse>
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "@/utils/backendTypes";
import ItemHealUse from "./ItemHealUse.vue";
import CheckUse from "./CheckUse.vue";
import ItemRollUse from "./ItemRollUse.vue";

defineProps<{ item: ConsolidatedItem }>();
</script>
