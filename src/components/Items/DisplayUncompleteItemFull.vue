<template>
  <DisplayItemName :item="item"></DisplayItemName>
  <p v-if="item.custom_fields?.weapon_type" class="mt-16 mb-0">
    <b>Type:</b> {{ item.custom_fields.weapon_type }}
  </p>
  <p v-if="item.custom_fields?.range" class="mt-16 mb-0">
    <b>Range:</b> {{ item.custom_fields.range }}
  </p>
  <DisplayWeaponFields :item="item"></DisplayWeaponFields>
  <p v-if="item.custom_fields?.special" class="mt-16 mb-0">
    <b>Special:</b> {{ item.custom_fields.special }}
  </p>
  <DisplayItemBulk :item="item"></DisplayItemBulk>
  <ItemDesc :item="item"></ItemDesc>
  <p v-if="item.custom_fields?.courses" class="mt-16 mb-0">
    <b>Courses:</b> {{ item.custom_fields.courses }}
  </p>
</template>

<script setup lang="ts">
import type { UncompleteEntityItem } from "@/utils/backendTypes";
import ItemDesc from "./ItemDesc.vue";
import DisplayItemName from "./DisplayItemName.vue";
import DisplayItemBulk from "./DisplayItemBulk.vue";
import DisplayWeaponFields from "./DisplayWeaponFields.vue";

defineProps<{ item: UncompleteEntityItem }>();
</script>
