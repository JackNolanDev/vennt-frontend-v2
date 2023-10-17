<template>
  <ActionDisabledWarning :action="item.name"></ActionDisabledWarning>
  <ItemUses v-if="showItemUses && !item.active" :item="item"></ItemUses>
  <ItemComment :item="item"></ItemComment>
  <div class="separator mt-24 mb-24"></div>
  <BaseButton @click="deleteItem" class="clear wide center">
    Remove Item
  </BaseButton>
  <div v-if="sellValue && !item.active" class="mt-8">
    <BaseButton @click="sellItem" class="primary wide center">
      Sell Item for {{ sellValue }} SP
    </BaseButton>
    <p class="pt-10 mutedText mt-4 mb-0">
      Note: This does not currently take into account any benefits your
      character may have to get a better (or worse) price. The shop value of
      this item is {{ shopValue }} SP.
    </p>
    <p v-if="shopItem?.name" class="mt-4 mb-0">
      <RouterLink
        :to="{
          name: ENTITY_ITEM_SHOP_ROUTE,
          params: { detail: shopItem.name },
          query: $route.query,
        }"
        class="stealth"
        >Visit the item shop</RouterLink
      >
    </p>
  </div>
  <BaseButton @click="emit('editButton')" icon="edit" class="wide mt-24">
    Edit item
  </BaseButton>
  <DisplayItemStorageToggle
    :item="item"
    class="mt-8"
  ></DisplayItemStorageToggle>
  <DisplayUseLatestItem :item="item"></DisplayUseLatestItem>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import type { ConsolidatedItem } from "@/utils/backendTypes";
import { findShopItem } from "@/utils/itemUtils";
import { prefixName } from "@/utils/textUtils";
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import ItemUses from "../Uses/ItemUses.vue";
import DisplayItemStorageToggle from "./DisplayItemStorageToggle.vue";
import DisplayUseLatestItem from "./DisplayUseLatestItem.vue";
import ItemComment from "./ItemComment.vue";
import { ENTITY_ITEM_SHOP_ROUTE } from "@/router";
import ActionDisabledWarning from "../Entities/ActionDisabledWarning.vue";

const props = defineProps<{ item: ConsolidatedItem }>();
const emit = defineEmits<{ (e: "editButton"): void }>();

const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

jsonStorage.fetchShopItems();
jsonStorage.fetchWeaponTypes();

const showItemUses = computed(() => !props.item.custom_fields?.in_storage);
const shopItem = computed(() =>
  findShopItem(props.item, jsonStorage.shopItems, jsonStorage.weaponTypes)
);
const shopValue = computed(() => shopItem.value && shopItem.value.sp);
const sellValue = computed(
  () => shopValue.value && Math.floor(shopValue.value / 2)
);

const deleteItem = () => {
  entityStore.deleteItem(props.item, true);
};
const sellItem = () => {
  if (!sellValue.value || !entityStore.entity) {
    return;
  }
  adjustAttrsAPI(
    entityStore.entity,
    entityStore.entityAttributes,
    { sp: sellValue.value },
    { msg: prefixName(props.item.name, "Sold", false) }
  );
  entityStore.deleteItem(props.item, true);
};
</script>
