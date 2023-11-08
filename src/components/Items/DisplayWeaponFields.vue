<template>
  <p v-if="item.custom_fields?.attr" class="mt-16 mb-0">
    <b>Attribute:</b> {{ item.custom_fields.attr }}
  </p>
  <p v-if="acc && (acc.result || acc.reason)" class="mt-16 mb-0">
    <b>Accuracy:</b> {{ acc.result }}
    <span class="mutedText">({{ acc.reason }})</span>
  </p>
  <p v-if="damageString" class="mt-16 mb-0">
    <b>Damage:</b> {{ damageString }}
  </p>
  <BaseButton
    v-if="showDamageDice && entityStore.inCombat"
    :disabled="
      entityStore.computedAttributes.actions &&
      entityStore.computedAttributes.actions.val < 2
    "
    @click="useWeapon"
    class="primary wide mt-8"
    ><template #customIcon
      ><WeaponIcon :item="item" class="mr-8"></WeaponIcon></template
    >Use 2 Actions</BaseButton
  >
  <div v-if="damageDice && showDamageDice" class="card mt-8 padded thin column">
    <ToggleableDiceSectionCopyable
      :dice="damageDice"
      :header="true"
      :comment="diceReason"
      :attrs="relatedDmgAttrs"
    ></ToggleableDiceSectionCopyable>
  </div>
  <SimpleAbilityTable
    v-if="onAttackAbilities.length > 0 && showDamageDice"
    :abilities="onAttackAbilities"
    :link-on-name="true"
    :show-uses="true"
    title="On Attack Abilities"
    class="mt-16"
  ></SimpleAbilityTable>
  <SimpleItemTable
    v-if="ammoItems.length > 0 && showDamageDice"
    :items="ammoItems"
    :link-on-name="true"
    title="Ammo"
    class="mt-16"
  ></SimpleItemTable>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import { useEntityStore } from "@/stores/entity";
import {
  type EntityItem,
  buildSettingsForAttrList,
  diceParseFromString,
} from "vennt-library";
import {
  weaponAccuracy,
  enhancedBaseDiceString,
  enhancedDmgString,
  relatedAttrsForWeapon,
} from "@/utils/weaponUtils";
import { computed } from "vue";
import SimpleAbilityTable from "../Abilities/SimpleAbilityTable.vue";
import ToggleableDiceSectionCopyable from "../Dice/ToggleableDiceSectionCopyable.vue";
import SimpleItemTable from "./SimpleItemTable.vue";
import BaseButton from "../Base/BaseButton.vue";
import WeaponIcon from "./WeaponIcon.vue";
import { adjustAttrsAPI } from "@/utils/attributeUtils";

const props = defineProps<{ item: EntityItem }>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const acc = computed(
  () =>
    entityStore.entity &&
    weaponAccuracy(props.item, entityStore.computedAttributes),
);
const damageDiceString = computed(
  () =>
    entityStore.entity &&
    enhancedBaseDiceString(props.item, entityStore.computedAttributes),
);
const damageString = computed(
  () =>
    damageDiceString.value &&
    enhancedDmgString(
      props.item,
      damageDiceString.value,
      entityStore.computedAttributes,
    ),
);
const diceReason = computed(
  () =>
    `${props.item.name} attack dmg${
      acc.value ? `, Accuracy: ${acc.value.result}` : ""
    }`,
);
const relatedDmgAttrs = computed(() =>
  relatedAttrsForWeapon(props.item, "dmg"),
);
const damageDice = computed(
  () =>
    damageDiceString.value &&
    diceParseFromString(
      damageDiceString.value,
      buildSettingsForAttrList(
        diceStore.defaultDiceSettings,
        relatedDmgAttrs.value,
        entityStore.computedAttributes,
      ),
      diceReason.value,
      entityStore.diceToggles,
      entityStore.computedAttributes,
      relatedDmgAttrs.value,
    ),
);
const showDamageDice = computed(
  () =>
    props.item.active &&
    !props.item.custom_fields?.in_storage &&
    props.item.type === "weapon",
);
const onAttackAbilities = computed(() =>
  entityStore.sortedAbilities.filter(
    (ability) => ability.custom_fields?.cost?.attack,
  ),
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
    ["Ammunition", "Ammo"].some((indicator) => item.name.includes(indicator)),
  );
});
const useWeapon = () => {
  if (!entityStore.entity) {
    return;
  }
  adjustAttrsAPI(
    entityStore.entity,
    entityStore.computedAttributes,
    { actions: -2 },
    { msg: `Made attack with ${props.item.name}` },
  );
};
</script>
