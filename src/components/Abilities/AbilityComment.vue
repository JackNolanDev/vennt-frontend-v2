<template>
  <BaseStealthTextEditor
    v-model="state.comment"
    placeholder="Comment"
    :save-button="true"
    @save="save"
  ></BaseStealthTextEditor>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import { reactive } from "vue";
import BaseStealthTextEditor from "../Base/BaseStealthTextEditor.vue";
import { useEntityStore } from "@/stores/entity";

const props = defineProps<{ ability: FullEntityAbility }>();
const state = reactive({ comment: props.ability.comment ?? "" });
const entityStore = useEntityStore();

const save = () => {
  entityStore.updateAbility(props.ability.id, { comment: state.comment });
};
</script>
