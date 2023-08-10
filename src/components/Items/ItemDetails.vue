<template>
  <div v-if="state.editItem">
    <EditItem :given-item="item" @submitted="toggleEditItem"></EditItem>
    <BaseButton @click="toggleEditItem" icon="highlight_off" class="wide mt-24">
      Cancel editing item
    </BaseButton>
  </div>
  <div v-else>
    <DisplayItemFull :item="item"></DisplayItemFull>
    <ItemDetailsInteraction
      v-if="showInteractionSection"
      :item="item"
      @edit-button="toggleEditItem"
    ></ItemDetailsInteraction>
    <div v-if="debug">
      <pre><code>{{ item }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConsolidatedItem } from "@/utils/backendTypes";
import DisplayItemFull from "./DisplayItemFull.vue";
import { computed, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import EditItem from "./EditItem.vue";
import ItemDetailsInteraction from "./ItemDetailsInteraction.vue";
import { isDefaultWeapon } from "@/utils/itemUtils";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ item: ConsolidatedItem }>();
const state = reactive({ editItem: false });

const entityStore = useEntityStore();

const showInteractionSection = computed(
  () => !isDefaultWeapon(props.item) && entityStore.canEdit
);

const toggleEditItem = () => {
  state.editItem = !state.editItem;
};

const debug = process.env.NODE_ENV === "development";
</script>
