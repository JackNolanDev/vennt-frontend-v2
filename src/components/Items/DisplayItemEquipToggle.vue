<template>
  <div v-if="itemEquippable(item) && entityStore.canEdit">
    <p
      v-if="entityStore.entityAttributes.free_hands"
      class="mt-16 mb-0 muted-text"
    >
      <b>Free Hands: </b>
      <span
        :class="{ errorText: entityStore.entityAttributes.free_hands.val < 0 }"
        >{{ entityStore.entityAttributes.free_hands.val }}</span
      >
    </p>
    <BaseButton v-if="item.active" @click="toggleActive" class="wide mt-16">
      <template #customIcon>
        <img
          src="/images/actions/drop-weapon.light.svg"
          alt=""
          width="40"
          height="40"
          class="mr-8"
        />
      </template>
      Unequip
    </BaseButton>
    <BaseButton v-else @click="toggleActive" class="wide mt-16">
      <template #customIcon>
        <img
          src="/images/actions/sword-brandish.light.svg"
          alt=""
          width="40"
          height="40"
          class="mr-8"
        />
      </template>
      Equip
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "@/utils/backendTypes";
import { itemEquippable } from "@/utils/itemUtils";
import BaseButton from "../Base/BaseButton.vue";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ item: ConsolidatedItem }>();
const entityStore = useEntityStore();

const toggleActive = () => {
  const itemUpdate = { active: !props.item.active };
  entityStore.updateItem(props.item.id, itemUpdate);
};
</script>
