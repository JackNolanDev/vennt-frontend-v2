<template>
  <BaseStealthTextEditor
    v-model="state.comment"
    placeholder="Comment"
    :save-button="true"
    @save="save"
    @cancel="cancel"
  ></BaseStealthTextEditor>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "vennt-library";
import { reactive, watch } from "vue";
import BaseStealthTextEditor from "../Base/BaseStealthTextEditor.vue";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ ability: FullEntityAbility }>();
const defaultState = props.ability.comment ?? "";
const state = reactive({ comment: defaultState });
const entityStore = useEntityStore();

watch(
  () => props.ability.id,
  () => {
    state.comment = props.ability.comment ?? "";
  }
);

const save = () => {
  entityStore.updateAbility(props.ability.id, { comment: state.comment });
};
const cancel = () => {
  state.comment = props.ability.comment ?? "";
};
</script>
