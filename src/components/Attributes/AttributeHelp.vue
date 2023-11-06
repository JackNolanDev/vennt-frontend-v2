<template>
  <p v-html="attrHelpHTML(attr)" class="mt-0 mb-8"></p>
</template>

<script setup lang="ts">
import type { EntityAttribute } from "vennt-library";
import { attrHelpHTML } from "@/utils/copy/attributeHelpCopy";

defineProps<{ attr: EntityAttribute }>();
</script>
