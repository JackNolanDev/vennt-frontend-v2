<template>
  <BaseButton
    v-if="entityStore.canEdit"
    @click="heroButton"
    :disabled="!enabled"
    clicked-note="Used a Hero Point"
    title="Use a hero point"
    icon="auto_awesome"
    class="selected"
    ><slot></slot
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
import type { PartialEntityAttributes } from "vennt-library";

const props = defineProps<{
  reason?: string;
  additionalAdjust?: PartialEntityAttributes;
}>();
const entityStore = useEntityStore();

const enabled = computed(
  () =>
    entityStore.entity &&
    entityStore.entityAttributes.hero &&
    entityStore.entityAttributes.hero.val > 0
);

const heroButton = () => {
  if (entityStore.entity) {
    const msg = props.reason
      ? props.reason
      : generateDefaultAdjustMsg("hero", -1);
    adjustAttrsAPI(
      entityStore.entity,
      entityStore.entityAttributes,
      { hero: -1, ...props.additionalAdjust },
      { msg }
    );
  }
};
</script>
