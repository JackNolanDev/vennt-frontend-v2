<template>
  <div class="alignRow">
    <BulletPoint :entity="entity.entity"></BulletPoint>
    <h2>Items</h2>
  </div>
  <div
    v-for="(item, index) in items"
    v-bind:key="index"
    class="card column padded mb-8"
  >
    <DisplayItemBasic :item="item"></DisplayItemBasic>
  </div>
</template>

<script setup lang="ts">
import type { CollectedEntity } from "vennt-library";
import {
  consolidateItemList,
  unsafeEnsureFullEntityItems,
} from "@/utils/itemUtils";
import { computed } from "vue";
import BulletPoint from "../Base/BulletPoint.vue";
import DisplayItemBasic from "../Items/DisplayItemBasic.vue";

const props = defineProps<{ entity: CollectedEntity }>();
const items = computed(() =>
  consolidateItemList(unsafeEnsureFullEntityItems(props.entity.items))
);
</script>
