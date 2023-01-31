<template>
  <BaseStealthTextEditor
    v-model="state.comment"
    :save-button="true"
    placeholder="Comment"
    @save="save"
    @cancel="cancel"
  ></BaseStealthTextEditor>
</template>

<script setup lang="ts">
import type { FullEntityItem } from "@/utils/backendTypes";
import { reactive, watch } from "vue";
import { useEntityStore } from "@/stores/entity";
import BaseStealthTextEditor from "../Base/BaseStealthTextEditor.vue";

const props = defineProps<{ item: FullEntityItem }>();
const state = reactive({ edit: false, comment: props.item.comment ?? "" });
const entityStore = useEntityStore();

watch(
  () => props.item.id,
  () => {
    state.comment = props.item.comment ?? "";
  }
);

const save = () => {
  entityStore.updateItem(props.item.id, { comment: state.comment });
};
const cancel = () => {
  state.comment = props.item.comment ?? "";
};
</script>
