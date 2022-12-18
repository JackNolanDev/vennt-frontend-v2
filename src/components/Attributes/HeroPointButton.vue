<template>
  <BaseButton
    @click="heroButton"
    :disabled="!enabled"
    title="Use a hero point"
    icon="auto_awesome"
    class="selected"
  ></BaseButton>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import {
  adjustAttrsAPI,
  generateDefaultAdjustMsg,
} from "@/utils/attributeUtils";
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{ reason?: string }>();
const entityStore = useEntityStore();

const enabled = computed(
  () =>
    entityStore.entity &&
    entityStore.entity.entity.attributes.hero &&
    entityStore.entity.entity.attributes.hero > 0
);

const heroButton = () => {
  if (entityStore.entity) {
    const msg = props.reason
      ? props.reason
      : generateDefaultAdjustMsg("hero", -1);
    adjustAttrsAPI(entityStore.entity, { hero: -1 }, msg);
  }
};
</script>
