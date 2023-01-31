<template>
  <div v-if="entityStore.entity">
    <h4>Quests</h4>
    <div v-for="(flux, idx) in fluxList" :key="type + idx">
      <BaseStealthTextEditor
        :placeholder="`Quest ${idx}`"
        :save-button="true"
      ></BaseStealthTextEditor>
    </div>
    <BaseButton icon="add" class="primary">Add new quest</BaseButton>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import BaseStealthTextEditor from "../Base/BaseStealthTextEditor.vue";
import type { EntityFluxType } from "@/utils/backendTypes";
import { computed } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{ type: EntityFluxType }>();
const entityStore = useEntityStore();

const fluxList = computed(() =>
  entityStore.entity?.flux.filter((flux) => flux.type === props.type)
);
</script>
