<template>
  <ConfirmationModal
    id="entity-add-grievous-wound-modal"
    trigger-icon="add"
    :main-button-disabled="state.selected === ''"
    @main-button="addGrievousWound"
  >
    <template #triggerButton>Add Grievous Wound</template>
    <template #title>Gain new Grievous Wound</template>
    <template #mainButton>Gain wound</template>
    <div class="space-for-ability-preview">
      <p>
        Follow instructions from
        <a href="https://vennt.fandom.com/wiki/Grievous_Wounds" target="_blank"
          >the official Vennt wiki</a
        >
        to select the correct grievous wound to take.
      </p>
      <div class="alignRow gap wrap">
        <label class="label-text no-wrap">Grievous Wound:</label>
        <select class="input grievous-wound-select" v-model="state.selected">
          <option value="">(Select your wound)</option>
          <option v-for="name in options" :key="name" :value="name">
            {{ name }}
          </option>
        </select>
      </div>
      <div
        v-if="selectedGrievousWound"
        class="card border column padded thin mt-8"
      >
        <h2><AbilityName :ability="selectedGrievousWound"></AbilityName></h2>
        <DisplayAbilityFull
          :ability="selectedGrievousWound"
          no-wiki-links
        ></DisplayAbilityFull>
      </div>
      <div v-else class="card border column padded thin mt-8">
        <h2>Preview will appear here</h2>
      </div>
    </div>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import ConfirmationModal from "../Base/ConfirmationModal.vue";
import { useEntityStore } from "@/stores/entity";
import { generalGrievousWounds } from "@/utils/copy/grievousWoundAbilities";
import { computed, reactive } from "vue";
import AbilityName from "../Abilities/AbilityName.vue";
import DisplayAbilityFull from "../Abilities/DisplayAbilityFull.vue";

const entityStore = useEntityStore();
const state = reactive({ selected: "" });

const options = generalGrievousWounds.map((ability) => ability.name);

const selectedGrievousWound = computed(() =>
  generalGrievousWounds.find((ability) => ability.name === state.selected),
);

const addGrievousWound = () => {
  if (selectedGrievousWound.value) {
    entityStore.addAbilities([selectedGrievousWound.value]);
  }
};
</script>

<style scoped>
.grievous-wound-select {
  width: 200px;
  flex-grow: 1;
}
.space-for-ability-preview {
  min-height: 400px;
}
</style>
