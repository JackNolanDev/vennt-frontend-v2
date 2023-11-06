<template>
  <div v-if="attrs.armor && showArmor">
    <div class="labelText mb-8">
      Armor: <span class="number ml-8">{{ attrs.armor.val }}</span>
    </div>
    <SimpleItemTable
      v-if="attrs.armor.items"
      :items="attrs.armor.items"
      :link-on-name="true"
      class="mb-8"
    ></SimpleItemTable>
    <SimpleAbilityTable
      v-if="attrs.armor.abilities"
      :abilities="attrs.armor.abilities"
      :link-on-name="true"
      class="mb-8"
    ></SimpleAbilityTable>
  </div>
  <div v-if="attrs.shield && showShields">
    <div class="labelText mb-8">
      Shield Bonus: <span class="number ml-8">{{ attrs.shield.val }}</span>
    </div>
    <SimpleItemTable
      v-if="attrs.shield.items"
      :items="attrs.shield.items"
      :link-on-name="true"
      class="mb-8"
    ></SimpleItemTable>
    <SimpleAbilityTable
      v-if="attrs.shield.abilities"
      :abilities="attrs.shield.abilities"
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
import type { UpdatedEntityAttributes } from "vennt-library";
import { computed } from "vue";
import SimpleAbilityTable from "../Abilities/SimpleAbilityTable.vue";
import BaseButton from "../Base/BaseButton.vue";
import SimpleItemTable from "../Items/SimpleItemTable.vue";

const entityStore = useEntityStore();

const props = defineProps<{
  attrs: UpdatedEntityAttributes;
}>();

const showArmor = computed(
  () =>
    (props.attrs.armor?.items && props.attrs.armor.items.length > 0) ||
    (props.attrs.armor?.abilities && props.attrs.armor.abilities.length)
);
const showShields = computed(
  () =>
    (props.attrs.shield?.items && props.attrs.shield.items.length > 0) ||
    (props.attrs.shield?.abilities && props.attrs.shield.abilities.length)
);
</script>
