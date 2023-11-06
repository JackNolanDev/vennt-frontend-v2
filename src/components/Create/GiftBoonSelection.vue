<template>
  <div class="card padded column mt-16">
    <p class="textBlock mt-0">
      <b>Select a Boon to go with your gift of {{ gift }}</b>
    </p>
    <BaseRadioButtons
      :options="options"
      :selected="boon ?? ''"
      :attrs="attrs"
      :unselectable="true"
      @selected-updated="(state) => emit('boonSelected', state)"
    ></BaseRadioButtons>
  </div>
</template>

<script setup lang="ts">
import type {
  CharacterGift,
  UpdatedEntityAttributes,
} from "vennt-library";
import { giftBoonCopy } from "@/utils/copy/giftBoonsCopy";
import { computed } from "vue";
import BaseRadioButtons from "../Base/BaseRadioButtons.vue";

const props = defineProps<{
  gift: CharacterGift;
  boon?: string;
  attrs?: UpdatedEntityAttributes;
}>();
const emit = defineEmits<{ (e: "boonSelected", state: string): void }>();

const options = computed(() =>
  Object.entries(giftBoonCopy).reduce<Record<string, string>>(
    (acc, [boon, copy]) => {
      if (copy.gift === props.gift) {
        acc[boon] = copy.ability.effect;
      }
      return acc;
    },
    {}
  )
);
</script>
