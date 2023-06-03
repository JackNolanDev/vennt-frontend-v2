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
      :comment="diceReason"
    ></ToggleableDiceSectionCopyable>
  </div>
  <SimpleAbilityTable
    v-if="onAttackAbilities.length > 0 && showDamageDice"
    :abilities="onAttackAbilities"
    :link-on-name="true"
    :show-uses="true"
    class="mt-16"
  ></SimpleAbilityTable>
  <SimpleItemTable
    v-if="ammoItems.length > 0 && showDamageDice"
    :items="ammoItems"
    :link-on-name="true"
    class="mt-16"
  ></SimpleItemTable>
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
import SimpleAbilityTable from "../Abilities/SimpleAbilityTable.vue";
import ToggleableDiceSectionCopyable from "../Dice/ToggleableDiceSectionCopyable.vue";
import SimpleItemTable from "./SimpleItemTable.vue";

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
    enhancedBaseDiceString(props.item, entityStore.entityAttributes)
);
const damageString = computed(
  () =>
    damageDiceString.value &&
    enhancedDmgString(props.item, damageDiceString.value)
);
const diceReason = computed(
  () =>
    `${props.item.name} attack dmg${
      acc.value ? `, Accuracy: ${acc.value.result}` : ""
    }`
);
const damageDice = computed(
  () =>
    damageDiceString.value &&
    diceParseFromString(
      damageDiceString.value,
      diceStore.defaultDiceSettings,
      diceReason.value
    )
);
const showDamageDice = computed(
  () => props.item.active && !props.item.custom_fields?.in_storage
);
const onAttackAbilities = computed(() =>
  entityStore.sortedAbilities.filter(
    (ability) => ability.custom_fields?.cost?.attack
  )
);
const ammoItems = computed(() => {
  if (
    props.item.custom_fields?.weapon_type?.toLowerCase().includes("ranged") &&
    !props.item.custom_fields.in_storage &&
    props.item.name !== "Improvised Attack"
  ) {
    return [];
  }
  return entityStore.consolidatedItems.filter((item) =>
    ["Ammunition", "Ammo"].some((indicator) => item.name.includes(indicator))
  );
});
</script>
