<template>
  <form>
    <h2 v-if="givenAbility">Edit {{ givenAbility.name }}</h2>
    <h2 v-else>New Ability</h2>
    <label for="new-ability-name" class="labelText">Name:</label>
    <input
      type="text"
      v-model="state.name"
      placeholder="Magic Boom"
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
          <select
            v-model="state.cost_passive"
            id="ability-cost-passive"
            class="input"
          >
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
            v-model.number="state.cost_mp"
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
            v-model.number="state.cost_vim"
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
            v-model.number="state.cost_hp"
            title="Amount of HP it costs to use ability"
            id="ability-cost-hp"
            class="input"
          />
        </div>
        <div class="cols-2 center-items">
          <label for="ability-cost-hero" class="labelText nowrap"
            >Hero Points</label
          >
          <input
            type="number"
            inputmode="numeric"
            placeholder="0"
            min="0"
            v-model.number="state.cost_hero"
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
            v-model.number="state.cost_actions"
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
            v-model.number="state.cost_reactions"
            title="Amount of Reactions it costs to use ability"
            id="ability-cost-reactions"
            class="input"
          />
        </div>
        <div class="cols-2 center-items">
          <label for="ability-cost-passive" class="labelText nowrap">
            On Attack
          </label>
          <select
            v-model="state.cost_attack"
            id="ability-cost-passive"
            class="input"
          >
            <option :value="false">None</option>
            <option :value="true">Activate</option>
          </select>
        </div>
        <div class="cols-2 center-items">
          <label for="ability-cost-downtime" class="labelText nowrap">
            Downtime Cost
          </label>
          <select
            v-model="state.cost_downtime"
            id="ability-cost-downtime"
            class="input"
          >
            <option value="">None</option>
            <option value="Respite">Respite</option>
            <option value="Intermission">Intermission</option>
          </select>
        </div>
      </div>
    </BaseDropDown>
    <div v-if="showPreview">
      <div class="separator mt-16 mb-16"></div>
      <h2>Ability Preview:</h2>
      <div class="card column padded thin">
        <h2>{{ newAbility.name }}</h2>
        <DisplayAbilityFull :ability="newAbility"></DisplayAbilityFull>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { generateAbilityActivation } from "@/utils/abilityUtils";
import type {
  AbilityCostMap,
  FullEntityAbility,
  UncompleteEntityAbility,
} from "@/utils/backendTypes";
import { editorEmpty } from "@/utils/textUtils";
import { computed, reactive } from "vue";
import BaseDropDown from "../Base/BaseDropDown.vue";
import BaseInlineTextEditor from "../Base/BaseInlineTextEditor.vue";
import DisplayAbilityFull from "./DisplayAbilityFull.vue";

const props = defineProps<{ givenAbility?: FullEntityAbility }>();
defineEmits<{ (e: "submitted"): void }>();

interface NewAbilityState {
  name: string;
  effect: string;
  cost_passive: boolean;
  cost_mp: string | number;
  cost_vim: string | number;
  cost_hp: string | number;
  cost_hero: string | number;
  cost_actions: string | number;
  cost_reactions: string | number;
  cost_attack: boolean;
  cost_downtime: "" | "Respite" | "Intermission";
}

const initialState: NewAbilityState = {
  name: props.givenAbility?.name ?? "",
  effect: props.givenAbility?.effect ?? "",
  cost_passive: props.givenAbility?.custom_fields?.cost?.passive ?? false,
  cost_mp: props.givenAbility?.custom_fields?.cost?.mp ?? "",
  cost_vim: props.givenAbility?.custom_fields?.cost?.vim ?? "",
  cost_hp: props.givenAbility?.custom_fields?.cost?.hp ?? "",
  cost_hero: props.givenAbility?.custom_fields?.cost?.hero ?? "",
  cost_actions: props.givenAbility?.custom_fields?.cost?.actions ?? "",
  cost_reactions: props.givenAbility?.custom_fields?.cost?.reactions ?? "",
  cost_attack: props.givenAbility?.custom_fields?.cost?.attack ?? false,
  cost_downtime: props.givenAbility?.custom_fields?.cost?.respite
    ? "Respite"
    : props.givenAbility?.custom_fields?.cost?.intermission
    ? "Intermission"
    : "",
};

const state = reactive({ ...initialState });

const showPreview = computed(() => !editorEmpty(state.name));

const newAbility = computed((): UncompleteEntityAbility => {
  const cost: AbilityCostMap = {
    ...(state.cost_passive && { passive: state.cost_passive }),
    ...(state.cost_attack && { attack: state.cost_attack }),
    ...(state.cost_downtime === "Respite" && { respite: true }),
    ...(state.cost_downtime === "Intermission" && { intermission: true }),
    ...(typeof state.cost_mp === "number" &&
      state.cost_mp > 0 && { mp: state.cost_mp }),
    ...(typeof state.cost_vim === "number" &&
      state.cost_vim > 0 && { vim: state.cost_vim }),
    ...(typeof state.cost_hp === "number" &&
      state.cost_hp > 0 && { hp: state.cost_hp }),
    ...(typeof state.cost_hero === "number" &&
      state.cost_hero > 0 && { hero: state.cost_hero }),
    ...(typeof state.cost_actions === "number" &&
      state.cost_actions > 0 && { actions: state.cost_actions }),
    ...(typeof state.cost_reactions === "number" &&
      state.cost_reactions > 0 && { reactions: state.cost_reactions }),
  };
  const activation = generateAbilityActivation(cost);
  const ability: UncompleteEntityAbility = {
    name: state.name,
    effect: state.effect,
    active: props.givenAbility?.active ?? false,
    custom_fields: { cost, activation },
  };
  return ability;
});
</script>

<style scoped>
.cost-section > div:not(:last-child) {
  margin-bottom: 8px;
}
</style>
