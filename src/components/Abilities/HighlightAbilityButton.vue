<template>
  <ConfirmationModal
    trigger-class="wide"
    trigger-icon="ink_highlighter"
    :id="ID"
    :noMainButton="true"
  >
    <template #triggerButton>Highlight</template>
    <template #title>Choose Color</template>
    <div class="cols-2 gap">
      <BaseButton
        v-for="{ name, color, cssVar } in colors"
        :key="name"
        @click="updateHighlight(color)"
        :style="`background-color: var(${cssVar})`"
        class="center outline-on-hover"
        >{{ name }}</BaseButton
      >
    </div>
    <BaseButton @click="removeHighlight" class="center wide mt-8"
      >Remove Highlight</BaseButton
    >
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import {
  type FullEntityAbility,
  type HighlightColor,
  RED_HIGHLIGHT,
  DARK_RED_HIGHLIGHT,
  ORANGE_HIGHLIGHT,
  DARK_ORANGE_HIGHLIGHT,
  GREEN_HIGHLIGHT,
  DARK_GREEN_HIGHLIGHT,
  BLUE_HIGHLIGHT,
  DARK_BLUE_HIGHLIGHT,
  GRAY_HIGHLIGHT,
  DARK_GRAY_HIGHLIGHT,
} from "vennt-library";
import ConfirmationModal from "../Base/ConfirmationModal.vue";
import BaseButton from "../Base/BaseButton.vue";

const ID = "highlight-ability-modal";

const props = defineProps<{ ability: FullEntityAbility }>();
const entityStore = useEntityStore();

const colors: Array<{ name: string; color: HighlightColor; cssVar: string }> = [
  { name: "Red", color: RED_HIGHLIGHT, cssVar: "--tomato-500" },
  { name: "Dark Red", color: DARK_RED_HIGHLIGHT, cssVar: "--tomato-700" },
  { name: "Orange", color: ORANGE_HIGHLIGHT, cssVar: "--orange-500" },
  { name: "Brown", color: DARK_ORANGE_HIGHLIGHT, cssVar: "--orange-700" },
  { name: "Green", color: GREEN_HIGHLIGHT, cssVar: "--forest-green-500" },
  {
    name: "Dark Green",
    color: DARK_GREEN_HIGHLIGHT,
    cssVar: "--forest-green-700",
  },
  { name: "Blue", color: BLUE_HIGHLIGHT, cssVar: "--blue-500" },
  { name: "Dark Blue", color: DARK_BLUE_HIGHLIGHT, cssVar: "--blue-700" },
  { name: "Gray", color: GRAY_HIGHLIGHT, cssVar: "--gray-700" },
  { name: "Dark Gray", color: DARK_GRAY_HIGHLIGHT, cssVar: "--gray-925" },
];

const updateHighlight = (highlight: HighlightColor) => {
  const dialog = document.getElementById(ID) as HTMLDialogElement | null;
  dialog?.close();

  entityStore.updateAbility(props.ability.id, {
    custom_fields: { ...props.ability.custom_fields, highlight },
  });
};

const removeHighlight = () => {
  const dialog = document.getElementById(ID) as HTMLDialogElement | null;
  dialog?.close();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { highlight, ...custom_fields } = props.ability.custom_fields!;
  entityStore.updateAbility(props.ability.id, { custom_fields });
};
</script>
