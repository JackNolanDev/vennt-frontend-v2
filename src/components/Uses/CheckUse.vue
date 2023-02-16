<template>
  <div class="card column padded thin mt-16">
    <ToggleableDiceSectionCopyable
      :attr="use.attr"
      :dice="dice"
    ></ToggleableDiceSectionCopyable>
  </div>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import { useEntityStore } from "@/stores/entity";
import type { UsesCheck } from "@/utils/backendTypes";
import { defaultDice } from "@/utils/diceUtils";
import { computed } from "vue";
import ToggleableDiceSectionCopyable from "../Dice/ToggleableDiceSectionCopyable.vue";

const props = defineProps<{ use: UsesCheck }>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const dice = computed(() =>
  defaultDice(entityStore.entityAttributes, props.use.attr, {
    ...diceStore.defaultDiceSettings,
    end: props.use.bonus,
  })
);
</script>
