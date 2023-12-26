<template>
  <BaseDropDown
    v-if="entityStore.entity && entityStore.isOwner"
    @change="downloadEntity"
    title="Save full entity"
  >
    <div class="m-8">
      <div v-if="state.entity">
        <a :download="`${state.entity.entity.name}.json`" :href="downloadHref"
          >Download entity</a
        >
      </div>
      <div v-else>Loading...</div>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import { fetchCollectedEntityFullApi } from "@/api/apiEntity";
import BaseDropDown from "@/components/Base/BaseDropDown.vue";
import { useEntityStore } from "@/stores/entity";
import type { FullCollectedEntityWithChangelog } from "vennt-library";
import { computed, reactive } from "vue";

const state = reactive<{ entity?: FullCollectedEntityWithChangelog }>({});
const entityStore = useEntityStore();

const downloadEntity = async () => {
  const entityId = entityStore.entity?.entity.id;
  if (!entityId) {
    return;
  }
  if (state.entity) {
    if (state.entity.entity.id !== entityId) {
      state.entity = undefined;
    } else {
      return;
    }
  }
  state.entity = await fetchCollectedEntityFullApi(entityId);
};

const downloadHref = computed(() => {
  const data = JSON.stringify(state.entity, undefined, 2);
  return URL.createObjectURL(new Blob([data], { type: "application/json" }));
});
</script>
