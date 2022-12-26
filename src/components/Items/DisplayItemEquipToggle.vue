<template>
  <div v-if="itemEquippable(item)">
    <BaseButton v-if="item.active" @click="toggleActive" class="wide">
      <template #customIcon>
        <DropWeapon class="mr-8"></DropWeapon>
      </template>
      Unequip
    </BaseButton>
    <BaseButton v-else @click="toggleActive" class="wide">
      <template #customIcon>
        <SwordBrandish class="mr-8"></SwordBrandish>
      </template>
      Equip
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "@/utils/backendTypes";
import { itemEquippable } from "@/utils/itemUtils";
import BaseButton from "../Base/BaseButton.vue";
import DropWeapon from "../SVG/DropWeapon.vue";
import SwordBrandish from "../SVG/SwordBrandish.vue";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ item: ConsolidatedItem }>();
const entityStore = useEntityStore();

const toggleActive = () => {
  const itemUpdate = { active: !props.item.active };
  entityStore.updateItem(props.item.id, itemUpdate);
};
</script>
