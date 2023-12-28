<template>
  <form>
    <h2 v-if="givenAbility">Edit {{ givenAbility.name }}</h2>
    <h2 v-else>New Ability</h2>
    <label for="new-ability-name" class="label-text">Name:</label>
    <input
      type="text"
      autocomplete="off"
      v-model="state.name"
      placeholder="Magic Boom"
      title="Enter the name of your ability"
      id="new-ability-name"
      class="input wide mt-2 mb-8"
    />
    <p class="mt-0 mb-0 label-text">Description:</p>
    <BaseInlineTextEditor
      v-model="state.effect"
      placeholder="Big magical blast"
      class="mt-2 mb-8"
    ></BaseInlineTextEditor>
    <BaseDropDown title="Usage Cost" class="mb-8">
      <div class="m-8 cost-section">
        <div class="cols-2 center-items">
          <label for="ability-cost-passive" class="label-text nowrap">
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
        <div v-if="!state.cost_passive" class="cost-section">
          <div class="cols-2 center-items">
            <label for="ability-cost-actions" class="label-text">Actions</label>
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
            <label for="ability-cost-reactions" class="label-text"
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
            <label for="ability-cost-mp" class="label-text">MP</label>
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
            <label for="ability-cost-vim" class="label-text">Vim</label>
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
            <label for="ability-cost-hp" class="label-text">HP</label>
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
            <label for="ability-cost-hero" class="label-text nowrap"
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
            <label for="ability-cost-on-attack" class="label-text nowrap">
              On Attack
            </label>
            <select
              v-model="state.cost_attack"
              id="ability-cost-on-attack"
              class="input"
            >
              <option :value="false">None</option>
              <option :value="true">Activate</option>
            </select>
          </div>
          <div class="cols-2 center-items" v-if="showDowntimeCost">
            <label for="ability-cost-downtime" class="label-text nowrap">
              Downtime Cost
            </label>
            <select
              v-model="state.cost_downtime"
              id="ability-cost-downtime"
              class="input"
            >
              <option value="">None</option>
              <option value="Respite">Respite</option>
              <option value="Rest">Rest</option>
              <option value="Intermission">Intermission</option>
            </select>
          </div>
        </div>
      </div>
    </BaseDropDown>
    <BaseDropDown title="Additional Details" class="mb-8">
      <div class="m-8">
        <label for="new-ability-flavor" class="label-text"
          ><i>Flavor:</i></label
        >
        <input
          type="text"
          v-model="state.flavor"
          placeholder="Wow! That was loud!"
          title="Enter some flavor for this ability"
          id="new-ability-flavor"
          class="input wide mt-2 mb-8"
        />
        <label for="new-ability-range" class="label-text">Range:</label>
        <input
          type="text"
          v-model="state.range"
          placeholder="12m"
          title="Enter the range of this ability"
          id="new-ability-range"
          class="input wide mt-2 mb-8"
        />
        <label for="new-ability-purchase" class="label-text"
          >Purchase Cost</label
        >
        <input
          type="text"
          v-model="state.purchase"
          placeholder="100 xp"
          title="Enter the purchase cost of the ability. Generally, abilities cost XP"
          id="new-ability-purchase"
          class="input wide mt-2 mb-8"
        />
        <label for="new-ability-expedited" class="label-text"
          >Expedited for</label
        >
        <input
          type="text"
          v-model="state.expedited"
          placeholder="Alertness, Magic"
          title="Gifts which the cost of this ability is expedited for"
          id="new-ability-expedited"
          class="input wide mt-2 mb-8"
        />
      </div>
    </BaseDropDown>
    <BaseDropDown title="Ability Functionality" class="mb-8">
      <div class="m-8 cost-section">
        <EditRollUse v-model="state.uses_roll" :name="newAbility.name"
          ><template #desc
            ><p class="mt-0 mb-8">
              Use this section when this Ability should heal some resources
              based on the result of a dice roll. E.g., heal 2d6+SPI Vim.
            </p></template
          ></EditRollUse
        >
        <EditHealUses
          v-model="state.uses_heal"
          drop-down-title="Heals / uses resources"
        >
          <template #desc
            ><p class="mt-0 mb-8">
              Use this section when this Ability should effect a base
              attribute's value permanently on use. For example, if this ability
              heals HP, or uses SP, or effects any custom attributes
            </p></template
          >
        </EditHealUses>
        <BaseDropDown title="Edit in JSON">
          <div class="m-8">
            <p class="mt-0 mb-8">
              This section is for manually editing this Ability's functionality
              using JSON.
            </p>
            <label class="label-text mb-4">Uses Override</label>
            <textarea
              v-model="state.uses_override"
              placeholder="{}"
              spellcheck="false"
              class="input code-input"
              :class="{ invalid: parseUsesOverride === false }"
            ></textarea>
            <BaseCopyableCode
              v-if="newAbility.uses"
              :text="JSON.stringify(newAbility.uses, null, 2)"
            ></BaseCopyableCode>
          </div>
        </BaseDropDown>
      </div>
    </BaseDropDown>
    <BaseButton
      :disabled="buttonDisabled"
      @click="addAbilityButton"
      class="primary center wide"
    >
      {{ givenAbility ? "Edit" : "Add" }} ability
    </BaseButton>
    <BaseButton
      v-if="givenAbility"
      @click="() => emit('submitted')"
      class="clear center wide mt-8"
    >
      Cancel Update
    </BaseButton>
    <div v-if="showPreview">
      <div class="separator mt-16 mb-16"></div>
      <h2>Ability Preview:</h2>
      <div class="card column padded thin">
        <h2>
          <AbilityName
            :ability="newAbility"
            :show-highlight="true"
          ></AbilityName>
        </h2>
        <DisplayAbilityFull
          :ability="newAbility"
          no-wiki-links
        ></DisplayAbilityFull>
        <AbilityAdditionalDetailDropdown
          :ability="newAbility"
          no-wiki-links
        ></AbilityAdditionalDetailDropdown>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { generateAbilityActivation } from "@/utils/abilityUtils";
import {
  abilityValidator,
  usesValidator,
  type AbilityCostMap,
  type FullEntityAbility,
  type UncompleteEntityAbility,
} from "vennt-library";
import { editorEmpty } from "@/utils/textUtils";
import { computed, reactive } from "vue";
import isEqual from "lodash.isequal";
import BaseButton from "../Base/BaseButton.vue";
import BaseDropDown from "../Base/BaseDropDown.vue";
import BaseInlineTextEditor from "../Base/BaseInlineTextEditor.vue";
import DisplayAbilityFull from "./DisplayAbilityFull.vue";
import AbilityName from "./AbilityName.vue";
import AbilityAdditionalDetailDropdown from "./AbilityAdditionalDetailDropdown.vue";
import {
  attrMapToEditUsesAdjustments,
  buildUses,
  type EditAdjustUses,
  type EditCheckUses,
  type EditRollUses,
  type EditUsesAdjustment,
} from "@/utils/usesUtils";
import EditRollUse from "../Uses/EditRollUse.vue";
import BaseCopyableCode from "../Base/BaseCopyableCode.vue";
import EditHealUses from "../Uses/EditHealUses.vue";

const props = defineProps<{ givenAbility?: FullEntityAbility }>();
const emit = defineEmits<{ (e: "submitted"): void }>();
const entityStore = useEntityStore();

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
  cost_downtime: "" | "Respite" | "Rest" | "Intermission";
  flavor: string;
  range: string;
  purchase: string;
  expedited: string;
  path: string;
  uses_override: string;
  uses_roll: EditRollUses;
  uses_heal: EditUsesAdjustment[];
  uses_adjust: EditAdjustUses;
  uses_check: EditCheckUses;
}

const initialState = (): NewAbilityState => ({
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
  flavor: props.givenAbility?.custom_fields?.flavor ?? "",
  range: props.givenAbility?.custom_fields?.range ?? "",
  purchase: props.givenAbility?.custom_fields?.purchase ?? "",
  expedited: props.givenAbility?.custom_fields?.expedited ?? "",
  path: props.givenAbility?.custom_fields?.path ?? "",
  uses_override: "",
  uses_roll: {
    attr: props.givenAbility?.uses?.roll?.attr ?? "",
    dice: props.givenAbility?.uses?.roll?.dice ?? "",
    adjusts: attrMapToEditUsesAdjustments(
      props.givenAbility?.uses?.roll?.heal ?? {},
    ),
  },
  uses_heal: attrMapToEditUsesAdjustments(
    props.givenAbility?.uses?.heal?.attr ?? {},
  ),
  uses_adjust: {
    time: props.givenAbility?.uses?.adjust?.time ?? "",
    adjusts: attrMapToEditUsesAdjustments(
      props.givenAbility?.uses?.adjust?.attr ?? {},
    ),
  },
  uses_check: {
    attr: props.givenAbility?.uses?.check?.attr ?? "",
    label: props.givenAbility?.uses?.check?.label ?? "",
    diceSetting: props.givenAbility?.uses?.check?.dice_settings ?? {},
  },
});

const state = reactive(initialState());

const showPreview = computed(() => !editorEmpty(state.name));
const showDowntimeCost = computed(
  () =>
    !(typeof state.cost_actions === "number" && state.cost_actions > 0) &&
    !(typeof state.cost_reactions === "number" && state.cost_reactions > 0),
);

const parseUsesOverride = computed(() => {
  try {
    const jsonObject = JSON.parse(state.uses_override);
    return usesValidator.parse(jsonObject);
  } catch (err) {
    return false;
  }
});

const newAbility = computed((): UncompleteEntityAbility => {
  let cost: AbilityCostMap | undefined = {
    ...(state.cost_passive && { passive: state.cost_passive }),
    ...(state.cost_attack &&
      !state.cost_passive && { attack: state.cost_attack }),
    ...(showDowntimeCost.value &&
      state.cost_downtime === "Respite" && { respite: true }),
    ...(showDowntimeCost.value &&
      state.cost_downtime === "Rest" && { rest: true }),
    ...(showDowntimeCost.value &&
      state.cost_downtime === "Intermission" && { intermission: true }),
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
  if (Object.keys(cost).length === 0) {
    cost = undefined;
  }
  const initial = initialState();
  const falseOnUnchanged = <T extends keyof NewAbilityState>(
    key: T,
  ): NewAbilityState[T] | false => {
    if (isEqual(state[key], initial[key])) {
      return false;
    }
    return state[key];
  };
  const uses = buildUses({
    defaultUses: props.givenAbility?.uses,
    usesOverride: parseUsesOverride.value,
    rollUses: falseOnUnchanged("uses_roll"),
    healUses: falseOnUnchanged("uses_heal"),
    adjustUses: falseOnUnchanged("uses_adjust"),
    checkUses: falseOnUnchanged("uses_check"),
  });
  const ability: UncompleteEntityAbility = {
    name: state.name,
    effect: state.effect,
    active: props.givenAbility?.active ?? false,
    comment: props.givenAbility?.comment,
    custom_fields: {
      ...props.givenAbility?.custom_fields,
      cost,
      activation,
      ...(state.flavor && { flavor: state.flavor }),
      ...(state.range && { range: state.range }),
      ...(state.purchase && { purchase: state.purchase }),
      ...(state.expedited && { expedited: state.expedited }),
      ...(state.path && { path: state.path }),
    },
    uses,
  };
  return ability;
});
const buttonDisabled = computed(
  () => !abilityValidator.safeParse(newAbility.value).success,
);
const addAbilityButton = () => {
  if (props.givenAbility) {
    entityStore.updateAbility(props.givenAbility.id, newAbility.value);
  } else {
    entityStore.addAbilities([newAbility.value], true);
  }
  emit("submitted");
  Object.entries(initialState()).forEach(([key, val]) => {
    // @ts-ignore
    state[key] = val;
  });
};
</script>

<style scoped>
.cost-section > div:not(:last-child) {
  margin-bottom: 4px;
}

.code-input {
  font-family: var(--code-font);
}
</style>
