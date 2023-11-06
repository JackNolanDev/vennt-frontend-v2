<template>
  <div class="card column padded thin mt-16">
    <ToggleableDiceSectionCopyable
      :attr="use.attr"
      :dice="dice"
      :header="true"
      :comment="diceComment"
      :skip-key="name"
    ></ToggleableDiceSectionCopyable>
  </div>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import { useEntityStore } from "@/stores/entity";
import { attrShortName } from "@/utils/attributeUtils";
import type { UsesCheck } from "vennt-library";
import { defaultDice, combineDiceSettings } from "@/utils/diceUtils";
import { computed } from "vue";
import ToggleableDiceSectionCopyable from "../Dice/ToggleableDiceSectionCopyable.vue";

const props = defineProps<{ use: UsesCheck; name: string }>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const diceComment = computed(
  () => `${attrShortName(props.use.attr)} check using ${props.name}`
);
const dice = computed(() =>
  defaultDice(
    entityStore.entityAttributes,
    props.use.attr,
    combineDiceSettings(
      diceStore.defaultDiceSettings,
      { end: props.use.bonus },
      entityStore.entityAttributes
    ),
    entityStore.diceToggles,
    diceComment.value,
    props.name
  )
);
</script>
