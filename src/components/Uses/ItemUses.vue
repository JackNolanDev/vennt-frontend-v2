<template>
  <ItemAdjustUse
    v-if="item.uses?.adjust && item.uses.adjust.time !== 'permanent'"
    :item="item"
  ></ItemAdjustUse>
  <ItemHealUse v-if="item.uses?.heal" :item="item"></ItemHealUse>
  <ItemRollUse v-if="item.uses?.roll" :item="item"></ItemRollUse>
  <CheckUse
    v-if="item.uses?.check"
    :use="item.uses.check"
    :name="item.name"
  ></CheckUse>
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "vennt-library";
import ItemHealUse from "./ItemHealUse.vue";
import CheckUse from "./CheckUse.vue";
import ItemRollUse from "./ItemRollUse.vue";
import ItemAdjustUse from "./ItemAdjustUse.vue";

defineProps<{ item: ConsolidatedItem }>();
</script>
