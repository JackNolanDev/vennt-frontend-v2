<template>
  <p v-if="item.weapon_type" class="mt-16 mb-0">
    <b>Type:</b> {{ item.weapon_type }}
  </p>
  <p v-if="item.range" class="mt-16 mb-0"><b>Range:</b> {{ item.range }}</p>
  <p class="mt-16 mb-0"><b>Bulk:</b> {{ item.bulk }}</p>
  <p v-if="item.attr" class="mt-16 mb-0"><b>Attribute:</b> {{ item.attr }}</p>
  <p class="mt-16 mb-0"><b>Cost:</b> {{ item.cost }}</p>
  <p v-if="item.examples" class="mt-16 mb-0">
    <b>Examples:</b> {{ item.examples }}
  </p>
  <p v-if="item.dmg" class="mt-16 mb-0"><b>Damage:</b> {{ item.dmg }}</p>
  <p v-if="item.special" class="mt-16 mb-0">
    <b>Special:</b> {{ item.special }}
  </p>
  <DisplayShopItemDesc :item="item"></DisplayShopItemDesc>
</template>

<script setup lang="ts">
import type { ShopItem } from "@/utils/backendTypes";
import DisplayShopItemDesc from "./DisplayShopItemDesc.vue";

defineProps<{ item: ShopItem }>();
</script>
