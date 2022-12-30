<template>
  <div class="alignRow gap">
    <p class="mt-16 mb-0"><b>Comment:</b></p>
    <BaseButton @click="toggleEdit" icon="chat"></BaseButton>
    <BaseButton
      v-if="showSaveComment"
      @click="saveComment"
      icon="save"
    ></BaseButton>
  </div>
  <BaseInlineTextEditor
    v-if="state.edit"
    v-model="state.comment"
    class="mt-4 mb-16"
  ></BaseInlineTextEditor>
  <div v-else-if="item.comment" v-html="renderMarkdown(item.comment)"></div>
</template>

<script setup lang="ts">
import type { FullEntityItem } from "@/utils/backendTypes";
import { computed, reactive } from "vue";
import BaseInlineTextEditor from "../Base/BaseInlineTextEditor.vue";
import { renderMarkdown } from "@/utils/textUtils";
import BaseButton from "../Base/BaseButton.vue";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ item: FullEntityItem }>();
const state = reactive({ edit: false, comment: props.item.comment ?? "" });
const entityStore = useEntityStore();

const showSaveComment = computed(
  () => state.comment && state.comment !== props.item.comment
);

const toggleEdit = () => {
  state.edit = !state.edit;
};

const saveComment = () => {
  const itemUpdate = { comment: state.comment };
  entityStore.updateItem(props.item.id, itemUpdate);
  toggleEdit();
};
</script>
