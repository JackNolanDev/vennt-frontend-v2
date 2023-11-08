<template>
  <p v-if="flavor && ability.custom_fields?.flavor" class="textBlock">
    <i>{{ improveTextForDisplay(ability.custom_fields.flavor) }}</i>
  </p>
  <div v-html="abilityHTML" class="textBlock"></div>
</template>

<script setup lang="ts">
import type { ComputedAttributes, EntityAbility } from "vennt-library";
import { renderMarkdown, improveTextForDisplay } from "@/utils/textUtils";
import { computed } from "vue";

const props = defineProps<{
  ability: EntityAbility;
  flavor?: boolean;
  attrs?: ComputedAttributes;
}>();
const abilityHTML = computed(() =>
  renderMarkdown(props.ability.effect, props.attrs),
);
</script>
