<template>
  <div v-if="state.editItem">
    <EditItem :given-item="item" @submitted="toggleEditItem"></EditItem>
    <BaseButton @click="toggleEditItem" icon="highlight_off" class="wide mt-24">
      Cancel editing item
    </BaseButton>
  </div>
  <div v-else>
    <DisplayItemFull :item="item"></DisplayItemFull>
    <ItemUses :item="item"></ItemUses>
    <div v-if="showInteractionSection">
      <ItemComment :item="item"></ItemComment>
      <div class="seperator mt-24 mb-24"></div>
      <BaseButton @click="deleteItem" class="clear wide center">
        Remove Item
      </BaseButton>
      <div v-if="sellValue" class="mt-8">
        <BaseButton @click="sellItem" class="primary wide center">
          Sell Item for {{ sellValue }} SP
        </BaseButton>
        <div class="pt-10 mutedText mt-4">
          Note: This does not currently take into account any benefits your
          character may have to get a better (or worse) price. The shop value of
          this item is {{ shopValue }} SP.
        </div>
      </div>
      <BaseButton @click="toggleEditItem" icon="edit" class="wide mt-24">
        Edit item
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "@/utils/backendTypes";
import DisplayItemFull from "./DisplayItemFull.vue";
import ItemUses from "../Uses/ItemUses.vue";
import { computed, reactive } from "vue";
import { findShopItem, isDefaultWeapon } from "@/utils/itemUtils";
import BaseButton from "../Base/BaseButton.vue";
import { useEntityStore } from "@/stores/entity";
import { useJsonStore } from "@/stores/jsonStorage";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import { prefixName } from "@/utils/textUtils";
import EditItem from "./EditItem.vue";
import ItemComment from "./ItemComment.vue";

const props = defineProps<{ item: ConsolidatedItem }>();
const state = reactive({ editItem: false });
const entityStore = useEntityStore();
const jsonStorage = useJsonStore();

jsonStorage.fetchShopItems();
jsonStorage.fetchWeaponTypes();

const showInteractionSection = computed(() => !isDefaultWeapon(props.item));
const shopItem = computed(
  () =>
    jsonStorage.shopItems &&
    jsonStorage.weaponTypes &&
    findShopItem(props.item, jsonStorage.shopItems, jsonStorage.weaponTypes)
);
const shopValue = computed(() => shopItem.value && shopItem.value.sp);
const sellValue = computed(
  () => shopValue.value && Math.floor(shopValue.value / 2)
);

const toggleEditItem = () => {
  state.editItem = !state.editItem;
};
const deleteItem = () => {
  entityStore.deleteItem(props.item, true);
};
const sellItem = () => {
  if (!sellValue.value || !entityStore.entity) {
    return;
  }
  adjustAttrsAPI(
    entityStore.entity,
    { sp: sellValue.value },
    prefixName(props.item.name, "Sold", false)
  );
  entityStore.deleteItem(props.item, true);
};
</script>
