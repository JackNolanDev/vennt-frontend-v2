<template>
  <DisplayItemName :item="item"></DisplayItemName>
  <p v-if="item.custom_fields?.weapon_type" class="mt-16 mb-0">
    <b>Type:</b> {{ item.custom_fields.weapon_type }}
  </p>
  <p v-if="item.custom_fields?.range" class="mt-16 mb-0">
    <b>Range:</b> {{ item.custom_fields.range }}
  </p>
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
  <div v-if="damageDice" class="card mt-8 padded thin column">
    <ToggleableDiceSectionCopyable
      :dice="damageDice"
    ></ToggleableDiceSectionCopyable>
  </div>
  <p v-if="item.custom_fields?.special" class="mt-16 mb-0">
    <b>Special:</b> {{ item.custom_fields.special }}
  </p>
  <DisplayItemBulk :item="item"></DisplayItemBulk>
  <ItemDesc :item="item"></ItemDesc>
  <p v-if="item.custom_fields?.courses" class="mt-16 mb-0">
    <b>Courses:</b> {{ item.custom_fields.courses }}
  </p>
</template>

<script setup lang="ts">
import type { UncompleteEntityItem } from "@/utils/backendTypes";
import ItemDesc from "./ItemDesc.vue";
import DisplayItemName from "./DisplayItemName.vue";
import DisplayItemBulk from "./DisplayItemBulk.vue";
import { useEntityStore } from "@/stores/entity";
import { computed } from "vue";
import {
  enhancedBaseDiceString,
  enhancedDmgString,
  weaponAccuracy,
} from "@/utils/weaponUtils";
import { useDiceStore } from "@/stores/dice";
import { diceParseFromString } from "@/utils/diceUtils";
import ToggleableDiceSectionCopyable from "../Dice/ToggleableDiceSectionCopyable.vue";

const props = defineProps<{ item: UncompleteEntityItem }>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const acc = computed(
  () =>
    entityStore.entity &&
    weaponAccuracy(props.item, entityStore.entity, entityStore.entityAttributes)
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
</script>
