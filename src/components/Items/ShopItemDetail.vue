<template>
  <h2>{{ prefixName(newItem.name, "Buy") }}</h2>
  <DisplayShopItem :item="item"></DisplayShopItem>
  <div class="separator thin mt-8 mb-8"></div>
  <form class="mb-64">
    <p v-if="ownedItem && countOwned > 0">
      You already have
      <RouterLink
        :to="{
          name: ENTITY_ITEMS_ROUTE,
          params: { detail: ownedItem.id },
          query: $route.query,
        }"
        class="stealth"
        >{{ pluralizeName(newItem.name, true, countOwned) }}</RouterLink
      >
    </p>
    <p v-else>You don't have any {{ pluralizeName(newItem.name, true) }} yet</p>
    <div class="alignRow gap">
      <label for="item-count" class="labelText nowrap">Number to buy:</label>
      <input
        type="number"
        inputmode="numeric"
        placeholder="1"
        v-model="state.count"
        id="item-count"
        min="1"
        max="20"
        :class="{ invalid: !countValid }"
        class="input"
      />
    </div>
    <p>
      <b>Cost:</b> {{ cost }} SP
      <span v-if="entityStore.entityAttributes.sp" class="mutedText">
        (You have {{ entityStore.entityAttributes.sp.val }} SP)
      </span>
    </p>
    <BaseButton
      v-if="entityStore.entityAttributes.sp && item.sp !== undefined"
      :disabled="!countValid || entityStore.entityAttributes.sp.val < item.sp"
      @click="buyItem"
      class="primary wide mb-8"
    >
      Buy for {{ cost }} SP
    </BaseButton>
    <BaseButton
      :disabled="!countValid"
      @click="addItem"
      title="Add this item to your inventory without paying for it"
      class="clear wide mb-8"
    >
      Take item
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import type { ShopItem, EntityItem } from "@/utils/backendTypes";
import { prefixName, pluralizeName } from "@/utils/textUtils";
import DisplayShopItem from "./DisplayShopItem.vue";
import { shopItemToEntityItem, shopItemActive } from "@/utils/itemUtils";
import { computed, reactive } from "vue";
import { useEntityStore } from "@/stores/entity";
import { adjustAttrsAPI } from "@/utils/attributeUtils";
import BaseButton from "../Base/BaseButton.vue";
import { ENTITY_ITEMS_ROUTE } from "@/router";

const props = defineProps<{ item: ShopItem }>();
const state = reactive({ count: "1" });
const entityStore = useEntityStore();

const ownedItem = computed(() => {
  return entityStore.consolidatedItems.find(
    (it) =>
      it.name === props.item.name &&
      it.bulk === props.item.bulk &&
      it.desc === props.item.desc
  );
});
const countOwned = computed(() => ownedItem.value?.ids.length ?? 0);
const newItem = computed(
  (): EntityItem =>
    shopItemToEntityItem(
      props.item,
      shopItemActive(props.item, entityStore.entity)
    )
);
const parsedCount = computed(() => {
  const countInt = parseInt(state.count);
  return isNaN(countInt) ? 0 : countInt;
});
const countValid = computed(
  () => parsedCount.value > 0 && parsedCount.value <= 20
);
const cost = computed(() => (props.item.sp ?? 0) * parsedCount.value);

const addItem = () => {
  const items = new Array(parsedCount.value).fill(newItem.value);
  entityStore.addItems(items);
  state.count = "1";
};
const buyItem = () => {
  if (entityStore.entity && props.item.sp) {
    adjustAttrsAPI(
      entityStore.entity,
      entityStore.entityAttributes,
      { sp: -cost.value },
      {
        msg: pluralizeName(
          newItem.value.name,
          false,
          parsedCount.value,
          "Purchased"
        ),
      }
    );
  }
  addItem();
};
</script>
