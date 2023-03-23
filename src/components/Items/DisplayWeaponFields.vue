<template>
  <p v-if="item.custom_fields?.attr" class="mt-16 mb-0">
    <b>Attribute:</b> {{ item.custom_fields.attr }}
  </p>
  <p v-if="item.custom_fields?.attr && acc" class="mt-16 mb-0">
    <b>Accuracy:</b> {{ acc.result }}
    <span class="mutedText">({{ acc.reason }})</span>
  </p>
  <p v-if="damageString" class="mt-16 mb-0">
    <b>Damage:</b> {{ damageString }}
  </p>
  <div v-if="damageDice && showDamageDice" class="card mt-8 padded thin column">
    <ToggleableDiceSectionCopyable
      :dice="damageDice"
      :header="true"
    ></ToggleableDiceSectionCopyable>
  </div>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import { useEntityStore } from "@/stores/entity";
import type { EntityItem } from "@/utils/backendTypes";
import { diceParseFromString } from "@/utils/diceUtils";
import {
  weaponAccuracy,
  enhancedBaseDiceString,
  enhancedDmgString,
} from "@/utils/weaponUtils";
import { computed } from "vue";
import ToggleableDiceSectionCopyable from "../Dice/ToggleableDiceSectionCopyable.vue";

const props = defineProps<{ item: EntityItem }>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const acc = computed(
  () =>
    entityStore.entity &&
    weaponAccuracy(props.item, entityStore.entityAttributes)
);
const damageDiceString = computed(
  () =>
    entityStore.entity &&
    enhancedBaseDiceString(
      props.item,
      entityStore.entity,
      entityStore.entityAttributes
    )
);
const damageString = computed(
  () =>
    damageDiceString.value &&
    enhancedDmgString(props.item, damageDiceString.value)
);
const damageDice = computed(
  () =>
    damageDiceString.value &&
    diceParseFromString(damageDiceString.value, diceStore.defaultDiceSettings)
);
const showDamageDice = computed(
  () => props.item.active && !props.item.custom_fields?.in_storage
);
</script>
