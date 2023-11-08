<template>
  <div v-if="state.editAbility">
    <EditAbility
      :given-ability="ability"
      @submitted="toggleEditAbility"
    ></EditAbility>
    <BaseButton
      @click="toggleEditAbility"
      icon="highlight_off"
      class="wide mt-24"
    >
      Cancel editing ability
    </BaseButton>
  </div>
  <div v-else>
    <h2>
      <AbilityName :ability="ability" :show-highlight="true"></AbilityName>
    </h2>
    <DisplayAbilityFull :ability="ability" :attrs="attrs"></DisplayAbilityFull>
    <AbilityAdditionalDetailDropdown
      :ability="ability"
      class="mt-16"
    ></AbilityAdditionalDetailDropdown>
    <AbilityDetailsInteractive
      :ability="ability"
      v-if="entityStore.canEdit"
      @edit-button="toggleEditAbility"
    ></AbilityDetailsInteractive>
    <div v-if="debug">
      <pre><code>{{ ability }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComputedAttributes, FullEntityAbility } from "vennt-library";
import DisplayAbilityFull from "./DisplayAbilityFull.vue";
import AbilityAdditionalDetailDropdown from "./AbilityAdditionalDetailDropdown.vue";
import { useEntityStore } from "@/stores/entity";
import AbilityDetailsInteractive from "./AbilityDetailsInteractive.vue";
import { reactive } from "vue";
import EditAbility from "./EditAbility.vue";
import BaseButton from "../Base/BaseButton.vue";
import AbilityName from "./AbilityName.vue";

defineProps<{ ability: FullEntityAbility; attrs?: ComputedAttributes }>();
const state = reactive({ editAbility: false });
const entityStore = useEntityStore();

const toggleEditAbility = () => {
  state.editAbility = !state.editAbility;
};

const debug = process.env.NODE_ENV === "development";
</script>
