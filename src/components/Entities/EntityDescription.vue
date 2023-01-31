<template>
  <BaseStealthTextEditor
    v-model="state.desc"
    :displayOnly="!entityStore.canEdit"
    placeholder="Character Description"
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
const state = reactive({ desc: entityStore.description });

const save = () => {
  if (state.desc) {
    entityStore.saveText("DESC", state.desc);
  }
};

const cancel = () => {
  state.desc = entityStore.description;
};
</script>
