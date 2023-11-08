<template>
  <div v-if="attrs.armor && showArmor">
    <div class="labelText mb-8">
      Armor: <span class="number ml-8">{{ attrs.armor.val }}</span>
    </div>
    <SimpleItemTable
      v-if="armorItems"
      :items="armorItems"
      :link-on-name="true"
      class="mb-8"
    ></SimpleItemTable>
    <SimpleAbilityTable
      v-if="armorAbilities"
      :abilities="armorAbilities"
      :link-on-name="true"
      class="mb-8"
    ></SimpleAbilityTable>
  </div>
  <div v-if="attrs.shield && showShields">
    <div class="labelText mb-8">
      Shield Bonus: <span class="number ml-8">{{ attrs.shield.val }}</span>
    </div>
    <SimpleItemTable
      v-if="shieldItems"
      :items="shieldItems"
      :link-on-name="true"
      class="mb-8"
    ></SimpleItemTable>
    <SimpleAbilityTable
      v-if="shieldAbilities"
      :abilities="shieldAbilities"
      :link-on-name="true"
      class="mb-8"
    ></SimpleAbilityTable>
  </div>
  <div v-if="!showArmor && !showShields && entityStore.entity?.entity.id">
    <BaseButton :to="{ name: ENTITY_ITEM_SHOP_ROUTE }" icon="store"
      >Buy Armor</BaseButton
    >
  </div>
</template>

<script setup lang="ts">
import { ENTITY_ITEM_SHOP_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";
import type {
  ComputedAttributes,
  EntityAttribute,
  FullEntityAbility,
  FullEntityItem,
} from "vennt-library";
import { computed } from "vue";
import SimpleAbilityTable from "../Abilities/SimpleAbilityTable.vue";
import BaseButton from "../Base/BaseButton.vue";
import SimpleItemTable from "../Items/SimpleItemTable.vue";

const entityStore = useEntityStore();

const props = defineProps<{
  attrs: ComputedAttributes;
}>();

const fetchAbilitiesAndItemsForAttr = (attr: EntityAttribute) => {
  const abilityIds: string[] = [];
  const itemIds: string[] = [];
  props.attrs[attr].reason?.forEach((reason) => {
    if (reason.abilityId) {
      abilityIds.push(reason.abilityId);
    }
    if (reason.itemId) {
      itemIds.push(reason.itemId);
    }
  });
  const abilities = abilityIds
    .map(
      (abilityId) =>
        entityStore.entity?.abilities.find(
          (ability) => ability.id === abilityId,
        ),
    )
    .filter((ability) => ability) as FullEntityAbility[];
  const items = itemIds
    .map(
      (itemId) => entityStore.entity?.items.find((item) => item.id === itemId),
    )
    .filter((item) => item) as FullEntityItem[];
  return { abilities, items };
};

const armorAbilitiesAndItems = computed(() => {
  return fetchAbilitiesAndItemsForAttr("armor");
});
const armorAbilities = computed(() => armorAbilitiesAndItems.value.abilities);
const armorItems = computed(() => armorAbilitiesAndItems.value.items);

const shieldAbilitiesAndItems = computed(() => {
  return fetchAbilitiesAndItemsForAttr("shield");
});
const shieldAbilities = computed(() => shieldAbilitiesAndItems.value.abilities);
const shieldItems = computed(() => shieldAbilitiesAndItems.value.items);

const showArmor = computed(
  () => armorAbilities.value.length > 0 || armorItems.value.length > 0,
);
const showShields = computed(
  () => shieldAbilities.value.length > 0 || shieldItems.value.length > 0,
);
</script>
