<template>
  <BaseStealthTextEditor
    v-model="state.backstory"
    :displayOnly="!entityStore.canEdit"
    placeholder="Backstory"
    editorId="entity-backstory-editor"
    :saveButton="true"
    @save="save"
    @cancel="cancel"
  ></BaseStealthTextEditor>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { reactive } from "vue";
import BaseStealthTextEditor from "../Base/BaseStealthTextEditor.vue";

const entityStore = useEntityStore();
const state = reactive({ backstory: entityStore.backstory });

const save = () => {
  if (state.backstory) {
    entityStore.saveText("BACKSTORY", state.backstory);
  }
};

const cancel = () => {
  state.backstory = entityStore.backstory;
};
</script>
