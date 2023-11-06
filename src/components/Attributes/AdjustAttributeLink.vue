<template>
  <BaseButton :to="link" icon="edit" class="title-case">
    Edit {{ attrFullName(attr) }} / History
  </BaseButton>
</template>

<script setup lang="ts">
import router, { ENTITY_ROUTE } from "@/router";
import type { EntityAttribute } from "vennt-library";
import BaseButton from "../Base/BaseButton.vue";
import { attrFullName } from "@/utils/attributeUtils";
import { computed } from "vue";

const props = defineProps<{ attr: EntityAttribute }>();
const link = computed(() => ({
  name: router.currentRoute.value.name ?? ENTITY_ROUTE,
  params: router.currentRoute.value.params,
  query: { ...router.currentRoute.value.query, attr: props.attr },
}));
</script>
