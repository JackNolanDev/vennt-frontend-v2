<template>
  <div class="card column padded thin mt-16">
    <ToggleableDiceSection
      :attr="use.attr"
      :dice="dice"
      :header="true"
      :comment="diceComment"
      :skip-key="name"
    ></ToggleableDiceSection>
  </div>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import { useEntityStore } from "@/stores/entity";
import {
  type UsesCheck,
  defaultDice,
  combineDiceSettings,
  attrShortName,
} from "vennt-library";
import { computed } from "vue";
import ToggleableDiceSection from "../Dice/ToggleableDiceSection.vue";

const props = defineProps<{ use: UsesCheck; name: string }>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const diceComment = computed(
  () => `${attrShortName(props.use.attr)} check using ${props.name}`,
);
const dice = computed(() =>
  defaultDice(
    entityStore.computedAttributes,
    props.use.attr,
    combineDiceSettings(
      diceStore.defaultDiceSettings,
      { end: props.use.bonus },
      entityStore.computedAttributes,
    ),
    entityStore.diceToggles,
    diceComment.value,
    props.name,
  ),
);
</script>
