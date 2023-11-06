<template>
  <h2 class="mt-0 mb-0">
    {{ itemName }}
    <span v-if="item.custom_fields && item.custom_fields.category"
      >(<a
        v-bind:href="`https://vennt.fandom.com/wiki/Weapons#${item.custom_fields.category}`"
        target="_blank"
        class="link stealth"
        >{{ item.custom_fields.category }}</a
      >)</span
    >
    <span v-if="item.type === 'consumable' && item.active">(Active)</span>
  </h2>
</template>

<script setup lang="ts">
import type { EntityItem } from "vennt-library";
import { prefixName } from "@/utils/textUtils";
import { computed } from "vue";

const props = defineProps<{ item: EntityItem; prefix?: string }>();
const itemName = computed(() => prefixName(props.item.name, props.prefix));
</script>
