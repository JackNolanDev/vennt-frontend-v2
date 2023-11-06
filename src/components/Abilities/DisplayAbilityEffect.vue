<template>
  <p v-if="flavor && ability.custom_fields?.flavor" class="textBlock">
    <i>{{ improveTextForDisplay(ability.custom_fields.flavor) }}</i>
  </p>
  <div v-html="abilityHTML" class="textBlock"></div>
</template>

<script setup lang="ts">
import type { EntityAbility, UpdatedEntityAttributes } from "vennt-library";
import { renderMarkdown, improveTextForDisplay } from "@/utils/textUtils";
import { computed } from "vue";

const props = defineProps<{
  ability: EntityAbility;
  flavor?: boolean;
  attrs?: UpdatedEntityAttributes;
}>();
const abilityHTML = computed(() =>
  renderMarkdown(props.ability.effect, props.attrs)
);
</script>
