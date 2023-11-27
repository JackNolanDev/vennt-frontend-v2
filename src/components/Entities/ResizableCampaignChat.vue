<template>
  <div>
    <div @mousedown="headerDragStart" class="alignRow split grabbable">
      <label class="label-text ml-8">Campaign Chat</label
      ><BaseButton :to="exitRoute" icon="close"></BaseButton>
    </div>
    <CampaignChat
      :entity-id="entityId"
      :in-route-based-sidebar="true"
      :height-override="state.boxHeight"
    ></CampaignChat>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import CampaignChat from "../Campaign/Chat/CampaignChat.vue";
import { useEntityStore } from "@/stores/entity";
import { useRoute } from "vue-router";

defineProps<{ entityId?: string }>();
const state = reactive({ boxHeight: 200, startMouseY: 0, startBoxHeight: 0 });
const entityStore = useEntityStore();
const route = useRoute();

const MIN_HEIGHT = 200;

onBeforeMount(() => {
  const localHeight = localStorage.getItem(localStorageId.value);
  if (localHeight) {
    const parsedHeight = parseInt(localHeight);
    if (parsedHeight && !isNaN(parsedHeight)) {
      state.boxHeight = parsedHeight;
    }
  }
});

const localStorageId = computed(() => entityStore.entity?.entity.id + "-ch");

const headerDragStart = (e: MouseEvent) => {
  e.preventDefault();
  state.startMouseY = e.clientY;
  state.startBoxHeight = state.boxHeight;
  document.onmouseup = endDrag;
  document.onmousemove = dragHeader;
};

const dragHeader = (e: MouseEvent) => {
  e.preventDefault();
  const offset = state.startMouseY - e.clientY;
  state.boxHeight = Math.min(
    Math.max(state.startBoxHeight + offset, MIN_HEIGHT),
    window.innerHeight * 0.6,
  );
};

const endDrag = () => {
  document.onmouseup = null;
  document.onmousemove = null;
  localStorage.setItem(localStorageId.value, state.boxHeight.toString());
};

const exitRoute = computed(() => {
  const { chat, ...query } = route.query;
  return { query };
});
</script>

<style scoped>
.grabbable {
  border: 1px solid var(--border);
  border-left: 0px;
  border-right: 0px;
  cursor: row-resize;
}
</style>
