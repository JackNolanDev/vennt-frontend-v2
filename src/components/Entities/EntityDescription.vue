<template>
  <BaseStealthTextEditor
    v-model="state.desc"
    :displayOnly="!entityStore.canEdit"
    :placeholder="placeholder"
    editorId="entity-description-editor"
    :saveButton="true"
    @save="save"
    @cancel="cancel"
  ></BaseStealthTextEditor>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { computed, reactive } from "vue";
import { titleText } from "@/utils/textUtils";
import BaseStealthTextEditor from "../Base/BaseStealthTextEditor.vue";

const entityStore = useEntityStore();
const state = reactive({ desc: entityStore.description });

const placeholder = computed(
  () => `${titleText(entityStore.entity?.entity.type ?? "")} Description`
);

const save = () => {
  if (state.desc) {
    entityStore.saveText("DESC", state.desc);
  }
};

const cancel = () => {
  state.desc = entityStore.description;
};
</script>
