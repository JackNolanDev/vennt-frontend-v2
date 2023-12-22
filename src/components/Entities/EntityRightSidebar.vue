<template>
  <CampaignChat
    v-if="showCampaignChat && !anyButCampaignChat"
    :entity-id="entityStore.entity?.entity.id"
    :in-route-based-sidebar="true"
  ></CampaignChat>
  <div v-else class="entity-right-sidebar">
    <div class="top">
      <div class="panel ml-16 mr-16 mb-64">
        <EditAbility v-if="showNewAbility"></EditAbility>
        <EditItem v-else-if="showNewItem"></EditItem>
        <DamageCalculator v-else-if="damageCalculator"></DamageCalculator>
        <BasicActionAssist v-else-if="assistCombat"></BasicActionAssist>
        <BasicActionAttack v-else-if="attackCombat"></BasicActionAttack>
        <BasicActionDelay v-else-if="delayCombat"></BasicActionDelay>
        <BasicActionMove v-else-if="moveCombat"></BasicActionMove>
        <ShopItemDetail v-else-if="shopItem" :item="shopItem"></ShopItemDetail>
        <AbilityDetails
          v-else-if="entityAbility"
          :ability="entityAbility"
          :attrs="entityStore.computedAttributes"
        ></AbilityDetails>
        <AbilitySearchDetails
          v-else-if="searchAbility"
          :ability="searchAbility"
        ></AbilitySearchDetails>
        <ItemDetails v-else-if="entityItem" :item="entityItem"></ItemDetails>
        <WeaponShopDetail
          v-else-if="weaponType"
          :item="weaponType"
        ></WeaponShopDetail>
        <div v-else>Not found</div>
      </div>
    </div>
    <ResizableCampaignChat
      v-if="showCampaignChat"
      :entity-id="entityStore.entity?.entity.id"
    ></ResizableCampaignChat>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import ItemDetails from "../Items/ItemDetails.vue";
import ShopItemDetail from "../Items/ShopItemDetail.vue";
import WeaponShopDetail from "../Items/WeaponShopDetail.vue";
import { computed } from "vue";
import { ENTITY_ITEM_SHOP_ROUTE } from "@/router";
import { useJsonStore } from "@/stores/jsonStorage";
import EditItem from "../Items/EditItem.vue";
import { idValidator } from "vennt-library";
import AbilityDetails from "../Abilities/AbilityDetails.vue";
import AbilitySearchDetails from "../Abilities/AbilitySearchDetails.vue";
import EditAbility from "../Abilities/EditAbility.vue";
import DamageCalculator from "./DamageCalculator/DamageCalculator.vue";
import BasicActionAssist from "../Combat/BasicActions/BasicActionAssist.vue";
import BasicActionAttack from "../Combat/BasicActions/BasicActionAttack.vue";
import BasicActionDelay from "../Combat/BasicActions/BasicActionDelay.vue";
import BasicActionMove from "../Combat/BasicActions/BasicActionMove.vue";
import CampaignChat from "../Campaign/Chat/CampaignChat.vue";
import { useCampaignStore } from "@/stores/campaign";
import { useRoute } from "vue-router";
import ResizableCampaignChat from "./ResizableCampaignChat.vue";

const entityStore = useEntityStore();
const campaignStore = useCampaignStore();
const jsonStorage = useJsonStore();
const route = useRoute();

const isUUID = computed(
  () => idValidator.safeParse(route.params.detail).success,
);

const showCampaignChat = computed(
  () => route.query.chat === "visible" && campaignStore.details,
);
const showNewItem = computed(() => route.query.new === "item");
const showNewAbility = computed(() => route.query.new === "ability");
const damageCalculator = computed(() => route.params.detail === "damage");
const assistCombat = computed(() => route.params.detail === "assist");
const attackCombat = computed(() => route.params.detail === "attack");
const delayCombat = computed(() => route.params.detail === "delay");
const moveCombat = computed(() => route.params.detail === "move");
const entityItem = computed(() =>
  isUUID.value
    ? entityStore.consolidatedItems.find(
        (item) => item.id === route.params.detail,
      )
    : jsonStorage.defaultWeapons.find(
        (weapon) => weapon.id === route.params.detail,
      ),
);
const shopItem = computed(
  () =>
    !isUUID.value &&
    route.name === ENTITY_ITEM_SHOP_ROUTE &&
    jsonStorage.shopItems.find((item) => item.name === route.params.detail),
);
const weaponType = computed(
  () =>
    !isUUID.value &&
    jsonStorage.weaponTypes.find(
      (item) => item.category === route.params.detail,
    ),
);
const entityAbility = computed(
  () =>
    isUUID.value &&
    entityStore.entity?.abilities.find(
      (ability) => ability.id === route.params.detail,
    ),
);
const searchAbility = computed(
  () =>
    !isUUID.value &&
    jsonStorage.abilities.abilities.find(
      (ability) => ability.name === route.params.detail,
    ),
);
const anyButCampaignChat = computed(
  () =>
    showNewItem.value ||
    showNewAbility.value ||
    damageCalculator.value ||
    assistCombat.value ||
    attackCombat.value ||
    delayCombat.value ||
    moveCombat.value ||
    entityItem.value ||
    shopItem.value ||
    weaponType.value ||
    entityAbility.value ||
    searchAbility.value,
);
</script>

<style scoped>
.entity-right-sidebar {
  height: calc(var(--page-height) - 46px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.top {
  overflow-y: scroll;
}

/* Mobile Styles */
@media screen and (max-width: 760px) {
  .entity-right-sidebar {
    height: unset;
  }
}
@media screen and (max-width: 396px) {
  .panel {
    margin-left: 4px;
    margin-right: 4px;
  }
}
</style>
