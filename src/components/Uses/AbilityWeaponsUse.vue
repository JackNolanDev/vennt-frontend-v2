<template>
  <h3>Attacks</h3>
  <BaseDropDown
    v-for="({ label, item }, idx) in convertedWeapons"
    :key="label + idx"
    :use-given-state="true"
    :given-closed="state.idx !== idx"
    :title="label"
    @change="switchDropDown(idx)"
  >
    <div class="mt-8 mb-8 ml-8 mr-8">
      <DisplayWeaponFields :item="item"></DisplayWeaponFields>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import { useJsonStore } from "@/stores/jsonStorage";
import type { FullEntityAbility, UncompleteEntityItem } from "vennt-library";
import { computed, reactive } from "vue";
import BaseDropDown from "../Base/BaseDropDown.vue";
import DisplayWeaponFields from "../Items/DisplayWeaponFields.vue";

const props = defineProps<{ ability: FullEntityAbility }>();
const state = reactive({ idx: -1 });
const jsonStorage = useJsonStore();
jsonStorage.fetchWeaponTypes();

const convertedWeapons = computed(
  () =>
    props.ability.uses?.weapons?.map((weaponFields) => {
      const baseWeapon = jsonStorage.weaponTypes.find(
        (base) => base.category === weaponFields.category,
      );

      const item: UncompleteEntityItem = {
        name: props.ability.name,
        type: "weapon",
        active: true,
        bulk: 0,
        desc: props.ability.effect,
        custom_fields: {
          ...baseWeapon,
          ...(props.ability.custom_fields?.range && {
            range: props.ability.custom_fields.range,
          }),
          ...weaponFields,
        },
      };

      return {
        item,
        label: weaponFields.label ?? item.custom_fields?.dmg ?? item.name,
      };
    }) ?? [],
);

const switchDropDown = (idx: number) => {
  if (idx === state.idx) {
    state.idx = -1;
  } else {
    state.idx = idx;
  }
};
</script>
