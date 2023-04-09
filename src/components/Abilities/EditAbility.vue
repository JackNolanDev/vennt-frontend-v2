<template>
  <form>
    <h2 v-if="givenAbility">Edit {{ givenAbility.name }}</h2>
    <h2 v-else>New Ability</h2>
    <label for="new-ability-name" class="labelText">Name:</label>
    <input
      type="text"
      v-model="state.name"
      placeholder="Donut"
      title="Enter the name of your ability"
      id="new-ability-name"
      class="input wide mt-4 mb-16"
    />
    <label class="labelText">Description:</label>
    <BaseInlineTextEditor
      v-model="state.effect"
      placeholder="Big magical blast"
      class="mt-4 mb-16"
    ></BaseInlineTextEditor>
    <BaseDropDown title="Ability Cost">
      <div class="mt-8 mb-8 ml-8 mr-8 cost-section">
        <div class="cols-2 center-items">
          <label for="ability-cost-passive" class="labelText nowrap">
            Is Passive
          </label>
          <select id="ability-cost-passive" class="input">
            <option :value="false">Not Passive</option>
            <option :value="true">Passive</option>
          </select>
        </div>
        <div class="cols-2 center-items">
          <label for="ability-cost-mp" class="labelText">MP</label>
          <input
            type="number"
            inputmode="numeric"
            placeholder="0"
            min="0"
            title="Amount of MP it costs to use ability"
            id="ability-cost-mp"
            class="input"
          />
        </div>
        <div class="cols-2 center-items">
          <label for="ability-cost-vim" class="labelText">Vim</label>
          <input
            type="number"
            inputmode="numeric"
            placeholder="0"
            min="0"
            title="Amount of vim it costs to use ability"
            id="ability-cost-vim"
            class="input"
          />
        </div>
        <div class="cols-2 center-items">
          <label for="ability-cost-hp" class="labelText">HP</label>
          <input
            type="number"
            inputmode="numeric"
            placeholder="0"
            min="0"
            title="Amount of HP it costs to use ability"
            id="ability-cost-hp"
            class="input"
          />
        </div>
        <div class="cols-2 center-items">
          <label for="ability-cost-hero" class="labelText">Hero Points</label>
          <input
            type="number"
            inputmode="numeric"
            placeholder="0"
            min="0"
            title="Amount of hero points it costs to use ability"
            id="ability-cost-hero"
            class="input"
          />
        </div>
        <div class="cols-2 center-items">
          <label for="ability-cost-actions" class="labelText">Actions</label>
          <input
            type="number"
            inputmode="numeric"
            placeholder="0"
            min="0"
            title="Amount of Actions it costs to use ability"
            id="ability-cost-actions"
            class="input"
          />
        </div>
        <div class="cols-2 center-items">
          <label for="ability-cost-reactions" class="labelText"
            >Reactions</label
          >
          <input
            type="number"
            inputmode="numeric"
            placeholder="0"
            min="0"
            title="Amount of Reactions it costs to use ability"
            id="ability-cost-reactions"
            class="input"
          />
        </div>
        <!--
        
        <label class="labelText">Vim</label>
        <label class="labelText">HP</label>
        <label class="labelText">Hero Points</label>
        <label class="labelText">Actions</label>
        <label class="labelText">Reactions</label>
        <label class="labelText">Attack</label>
        <label class="labelText">Respite</label>
        <label class="labelText">Intermission</label>
        -->
      </div>
    </BaseDropDown>
  </form>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import { reactive } from "vue";
import BaseDropDown from "../Base/BaseDropDown.vue";
import BaseInlineTextEditor from "../Base/BaseInlineTextEditor.vue";

const props = defineProps<{ givenAbility?: FullEntityAbility }>();
defineEmits<{ (e: "submitted"): void }>();

interface NewAbilityState {
  name: string;
  effect: string;
}

const initialState: NewAbilityState = {
  name: props.givenAbility?.name ?? "",
  effect: props.givenAbility?.effect ?? "",
};

const state = reactive({ ...initialState });
</script>

<style scoped>
.cost-section > div:not(:last-child) {
  margin-bottom: 8px;
}
</style>
