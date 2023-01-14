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
  <div
    v-else-if="ability.comment"
    v-html="renderMarkdown(ability.comment)"
  ></div>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import { computed, reactive } from "vue";
import BaseInlineTextEditor from "../Base/BaseInlineTextEditor.vue";
import { renderMarkdown } from "@/utils/textUtils";
import BaseButton from "../Base/BaseButton.vue";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ ability: FullEntityAbility }>();
const state = reactive({ edit: false, comment: props.ability.comment ?? "" });
const entityStore = useEntityStore();

const showSaveComment = computed(
  () => state.comment && state.comment !== props.ability.comment
);

const toggleEdit = () => {
  if (showSaveComment.value) {
    const abilityUpdate = { comment: state.comment };
    entityStore.updateAbility(props.ability.id, abilityUpdate);
  }
  state.edit = !state.edit;
};
</script>
