<template>
  <BaseButton
    v-if="showSaveComment"
    @click="toggleEdit"
    icon="save"
    class="wide mt-16"
  >
    Save Comment
  </BaseButton>
  <BaseButton v-else @click="toggleEdit" icon="chat" class="wide mt-16">
    Comment
  </BaseButton>
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
  if (showSaveComment.value) {
    const itemUpdate = { comment: state.comment };
    entityStore.updateItem(props.item.id, itemUpdate);
  }
  state.edit = !state.edit;
};
</script>
