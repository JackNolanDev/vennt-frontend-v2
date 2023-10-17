<template>
  <h2 v-if="item.category">{{ prefixName(item.category, "Buy") }} Weapon</h2>
  <DisplayShopItem :item="item"></DisplayShopItem>
  <div class="separator thin mt-8 mb-8"></div>
  <form>
    <div class="alignRow gap mb-4">
      <label for="weapon-shop-detail-name" class="labelText">Weapon:</label>
      <input
        type="text"
        v-model="state.weaponName"
        :placeholder="item.examples ?? 'Weapon name'"
        title="Enter the name / type for your weapon here"
        id="weapon-shop-detail-name"
        class="input wide"
      />
    </div>
    <label class="labelText mb-4">Description:</label>
    <BaseInlineTextEditor
      v-model="state.weaponDesc"
      :placeholder="item.desc"
      title="Enter a description of your weapon here"
      class="mb-16"
    ></BaseInlineTextEditor>
    <BaseButton
      v-if="
        typeof entityStore.entityAttributes.sp?.val === 'number' &&
        typeof item.sp === 'number'
      "
      :disabled="
        buttonsDisabled || entityStore.entityAttributes.sp.val < item.sp
      "
      @click="buyItem"
      class="primary wide mb-8"
    >
      Buy for {{ item.sp }} SP
    </BaseButton>
    <BaseButton
      :disabled="buttonsDisabled"
      @click="addItem"
      title="Add this item to your inventory without paying for it"
      class="clear wide mb-8"
    >
      Take weapon
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import {
  itemValidator,
  type EntityItem,
  type ShopItem,
} from "@/utils/backendTypes";
import DisplayShopItem from "./DisplayShopItem.vue";
import { prefixName } from "@/utils/textUtils";
import { computed, reactive } from "vue";
import BaseInlineTextEditor from "../Base/BaseInlineTextEditor.vue";
import BaseButton from "../Base/BaseButton.vue";
import { shopItemActive, shopItemToEntityItem } from "@/utils/itemUtils";
import { useEntityStore } from "@/stores/entity";
import { adjustAttrsAPI } from "@/utils/attributeUtils";

const props = defineProps<{ item: ShopItem }>();
const initialState = () => ({ weaponName: "", weaponDesc: props.item.desc });
const state = reactive(initialState());
const entityStore = useEntityStore();

const newItem = computed(
  (): EntityItem => ({
    ...shopItemToEntityItem(
      props.item,
      shopItemActive(props.item, entityStore.entity)
    ),
    name: state.weaponName,
    desc: state.weaponDesc || props.item.desc,
  })
);
const buttonsDisabled = computed(
  () => !itemValidator.safeParse(newItem.value).success
);

const addItem = () => {
  entityStore.addItems([newItem.value], true);
  state.weaponName = "";
  state.weaponDesc = "";
};
const buyItem = () => {
  if (entityStore.entity && props.item.sp) {
    adjustAttrsAPI(
      entityStore.entity,
      entityStore.entityAttributes,
      { sp: -props.item.sp },
      { msg: `Purchased "${state.weaponName}"` }
    );
  }
  addItem();
};
</script>
