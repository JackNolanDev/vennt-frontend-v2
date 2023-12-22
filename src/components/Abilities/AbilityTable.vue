<template>
  <table v-if="abilities.length > 0" class="no-border">
    <thead
      class="main-table"
      :class="{
        sticky: stickyHeader,
      }"
    >
      <tr>
        <th>
          <div
            :tabindex="
              showTableOptions && nameSortIcon === 'swap_vert' ? 0 : -1
            "
            class="alignRow split header-hover"
            :class="{ visible: nameSortIcon !== 'swap_vert' }"
          >
            Ability
            <BaseButton
              v-if="showTableOptions"
              @click="nameSortButton"
              title="Sort by ability name"
              :icon="nameSortIcon"
              class="header-hover-show small-icon"
            ></BaseButton>
          </div>
        </th>
        <th v-if="state.options.showPath" class="ability-path">
          <div
            :tabindex="
              showTableOptions && pathSortIcon === 'swap_vert' ? 0 : -1
            "
            class="alignRow split header-hover"
            :class="{ visible: pathSortIcon !== 'swap_vert' }"
          >
            Path
            <BaseButton
              v-if="showTableOptions"
              @click="pathSortButton"
              title="Sort by path"
              :icon="pathSortIcon"
              class="header-hover-show small-icon"
            ></BaseButton>
          </div>
        </th>
        <th>
          <div
            :tabindex="
              showTableOptions && activationSortIcon === 'swap_vert' ? 0 : -1
            "
            class="alignRow split header-hover"
            :class="{ visible: activationSortIcon !== 'swap_vert' }"
          >
            Activation
            <BaseButton
              v-if="showTableOptions"
              @click="activationSortButton"
              title="Sort by activation cost"
              :icon="activationSortIcon"
              class="header-hover-show small-icon"
            ></BaseButton>
          </div>
        </th>
        <th v-if="searchId" class="ability-effect">
          <div class="alignRow gap">
            <label :for="searchId">Effect</label>
            <div class="alignRow wide">
              <input
                placeholder="Search Abilities"
                type="text"
                inputmode="search"
                v-model="state.search"
                title="Search for abilities in this table"
                :id="searchId"
                class="input"
              />
              <BaseButton
                @click="state.search = ''"
                :disabled="state.search === ''"
                icon="close"
                title="Clear current search"
              ></BaseButton>
            </div>
          </div>
        </th>
        <th v-else class="ability-effect">Effect</th>
        <th class="no-padding">
          <ConfirmationModal
            v-if="showTableOptions"
            id="ability-table-settings"
            trigger-icon="tune"
            trigger-title="Update table settings"
            hide-buttons
          >
            <template #title>Abilities table settings</template>
            <div class="cols-1 gap">
              <div class="alignRow gap ability-effect-search">
                <label
                  for="entity-table-search-modal"
                  class="label-text no-wrap reset-font-weight"
                  >Search Abilities</label
                >
                <input
                  placeholder="Search Abilities"
                  type="text"
                  inputmode="search"
                  v-model="state.search"
                  title="Search for abilities in this table"
                  id="entity-table-search-modal"
                  class="input"
                />
              </div>
              <BaseCheckBox
                :checked="state.options.showPath"
                highlight
                @click="toggleShowPath"
                class="wide ability-path"
                >Show Paths column in table</BaseCheckBox
              >
              <BaseCheckBox
                :checked="state.options.separatePassive"
                highlight
                @click="toggleSeparatePassive"
                class="wide ability-path"
                >Separate passive abilities</BaseCheckBox
              >
              <div class="alignRow gap">
                <label
                  for="entity-table-search-modal"
                  class="label-text no-wrap reset-font-weight"
                  >Sort:</label
                >
                <select
                  v-model="state.options.sort"
                  id="update-role"
                  class="input"
                >
                  <option
                    v-for="(desc, role) in SORT_OPTIONS"
                    :key="role"
                    :value="role"
                  >
                    {{ desc }}
                  </option>
                </select>
              </div>
            </div>
          </ConfirmationModal>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(ability, index) in filteredAbilities"
        v-bind:key="index"
        v-bind:id="stringToLinkID(ability.id)"
        v-bind:class="abilityOpened(ability) ? 'selected' : ''"
      >
        <td
          :class="{
            highlight: ability.custom_fields?.highlight,
            [ability.custom_fields?.highlight ?? 'red']: true,
          }"
          class="ability-name"
        >
          <AbilityName :ability="ability"></AbilityName>
        </td>
        <td v-if="state.options.showPath" class="ability-path">
          <BaseButton
            v-if="searchId"
            @click="pathSearchButton(ability)"
            title="Only show abilities from this path"
            class="small-text skinny wrap wide"
            >{{ abilityPath(ability) }}</BaseButton
          ><span v-else>{{ abilityPath(ability) }}</span>
        </td>
        <td :class="{ errorText: tooExpensive(ability) }">
          {{ ability.custom_fields?.activation }}
        </td>
        <td class="ability-effect condense-child-text">
          <DisplayAbilityEffect
            :ability="ability"
            :attrs="attrs"
          ></DisplayAbilityEffect>
        </td>
        <td class="no-padding action-button">
          <BaseButton
            v-if="abilityOpened(ability)"
            :to="abilityLink(ability)"
            icon="keyboard_arrow_left"
            title="Close ability details"
          ></BaseButton>
          <BaseButton
            v-else
            :to="abilityLink(ability)"
            icon="keyboard_arrow_right"
            title="Open ability details"
          ></BaseButton>
        </td>
      </tr>
      <tr v-if="filteredAbilities.length === 0">
        <td colspan="100">
          <div class="alignRow gap">
            No abilities matched search!
            <BaseButton @click="state.search = ''" class="small-text skinny"
              >Clear search?</BaseButton
            >
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import router, { ENTITY_ABILITIES_ROUTE } from "@/router";
import type { ComputedAttributes, FullEntityAbility } from "vennt-library";
import { stringToLinkID } from "@/utils/textUtils";
import type { RouteLocationRaw } from "vue-router";
import DisplayAbilityEffect from "./DisplayAbilityEffect.vue";
import BaseButton from "../Base/BaseButton.vue";
import AbilityName from "./AbilityName.vue";
import { computed, onBeforeMount, reactive } from "vue";
import ConfirmationModal from "../Base/ConfirmationModal.vue";
import BaseCheckBox from "../Base/BaseCheckBox.vue";
import { boolean, z } from "zod";
import { ABILITY_TABLE_LOCAL_STORAGE } from "@/utils/constants";
import {
  abilitySortFunction,
  sortByActivation,
  sortByName,
  sortByPath,
} from "@/utils/abilitySortUtils";
import { useJsonStore } from "@/stores/jsonStorage";
import { sortPaths, canUseAbility } from "@/utils/abilityUtils";

const jsonStorage = useJsonStore();

const props = defineProps<{
  abilities: FullEntityAbility[];
  attrs?: ComputedAttributes;
  searchId?: string;
  showTableOptions?: boolean;
  stickyHeader?: boolean;
  inCombat?: boolean;
}>();

const SORT_OPTIONS = {
  DEFAULT: "Default sorting option",
  NAME: "Alphabetical name",
  NAME_INV: "Reverse alphabetical name",
  PATH: "Topological sort of paths",
  PATH_INV: "Reverse topological sort of paths",
  ACTIVATION: "Activation cost",
  ACTIVATION_INV: "Reverse activation cost",
};

const optionsValidator = z.object({
  showPath: boolean().default(false),
  separatePassive: boolean().default(true),
  sort: z
    .enum([
      "DEFAULT",
      "NAME",
      "NAME_INV",
      "PATH",
      "PATH_INV",
      "ACTIVATION",
      "ACTIVATION_INV",
    ])
    .default("DEFAULT"),
});
type AbilityTableOptions = z.infer<typeof optionsValidator>;

const state = reactive<{ search: string; options: AbilityTableOptions }>({
  search: "",
  options: { showPath: false, separatePassive: true, sort: "DEFAULT" },
});

onBeforeMount(() => {
  if (props.showTableOptions) {
    const rawOptions = localStorage.getItem(ABILITY_TABLE_LOCAL_STORAGE);
    if (rawOptions) {
      try {
        const jsonOptions = JSON.parse(rawOptions);
        state.options = optionsValidator.parse(jsonOptions);
      } catch (err) {
        localStorage.removeItem(ABILITY_TABLE_LOCAL_STORAGE);
      }
    }
  }
});

const sortedPaths = computed(() => {
  const paths = jsonStorage.pathGraph.topologicalSort();
  if (paths.length === 0) {
    return sortPaths(props.abilities);
  }
  return paths;
});

const filteredAbilities = computed(() => {
  let filtered: FullEntityAbility[] = props.abilities;
  if (state.search && props.searchId) {
    const searchStr = state.search.toLowerCase();
    filtered = props.abilities.filter(
      (ability) =>
        ability.name.toLowerCase().includes(searchStr) ||
        ability.effect.toLowerCase().includes(searchStr) ||
        ability.custom_fields?.path?.toLowerCase().includes(searchStr),
    );
  }

  switch (state.options.sort) {
    case "NAME":
      filtered.sort(
        abilitySortFunction(sortByName, {
          separatePassive: state.options.separatePassive,
        }),
      );
      break;
    case "NAME_INV":
      filtered.sort(
        abilitySortFunction(sortByName, {
          inverse: true,
          separatePassive: state.options.separatePassive,
        }),
      );
      break;
    case "PATH":
      filtered.sort(
        abilitySortFunction(sortByPath(sortedPaths.value), {
          separatePassive: state.options.separatePassive,
        }),
      );
      break;
    case "PATH_INV":
      filtered.sort(
        abilitySortFunction(sortByPath(sortedPaths.value), {
          inverse: true,
          separatePassive: state.options.separatePassive,
        }),
      );
      break;
    case "ACTIVATION":
      filtered.sort(
        abilitySortFunction(sortByActivation, {
          separatePassive: state.options.separatePassive,
        }),
      );
      break;
    case "ACTIVATION_INV":
      filtered.sort(
        abilitySortFunction(sortByActivation, {
          inverse: true,
          separatePassive: state.options.separatePassive,
        }),
      );
      break;
  }
  return filtered;
});

const nameSortIcon = computed(() => {
  switch (state.options.sort) {
    case "NAME":
      return "arrow_downward";
    case "NAME_INV":
      return "arrow_upward";
    default:
      return "swap_vert";
  }
});
const pathSortIcon = computed(() => {
  switch (state.options.sort) {
    case "PATH":
      return "arrow_downward";
    case "PATH_INV":
      return "arrow_upward";
    default:
      return "swap_vert";
  }
});
const activationSortIcon = computed(() => {
  switch (state.options.sort) {
    case "ACTIVATION":
      return "arrow_downward";
    case "ACTIVATION_INV":
      return "arrow_upward";
    default:
      return "swap_vert";
  }
});

const nameSortButton = () => {
  if (state.options.sort === "NAME") {
    state.options.sort = "NAME_INV";
  } else {
    state.options.sort = "NAME";
  }
  saveAbilityTableSettings();
};
const pathSortButton = () => {
  if (state.options.sort === "PATH") {
    state.options.sort = "PATH_INV";
  } else {
    state.options.sort = "PATH";
  }
  saveAbilityTableSettings();
};
const activationSortButton = () => {
  if (state.options.sort === "ACTIVATION") {
    state.options.sort = "ACTIVATION_INV";
  } else {
    state.options.sort = "ACTIVATION";
  }
  saveAbilityTableSettings();
};

const abilityPath = (ability: FullEntityAbility) =>
  ability.custom_fields?.path?.startsWith("Path of the ")
    ? ability.custom_fields?.path.substring(12)
    : ability.custom_fields?.path;
const abilityOpened = (ability: FullEntityAbility): boolean =>
  router.currentRoute.value.params.detail === ability.id;
const abilityLink = (ability: FullEntityAbility): RouteLocationRaw => {
  if (abilityOpened(ability)) {
    const params = { ...router.currentRoute.value.params };
    delete params.detail;
    return {
      name: router.currentRoute.value.name ?? ENTITY_ABILITIES_ROUTE,
      params,
      query: router.currentRoute.value.query,
    };
  }
  return {
    name: router.currentRoute.value.name ?? ENTITY_ABILITIES_ROUTE,
    params: { ...router.currentRoute.value.params, detail: ability.id },
    query: router.currentRoute.value.query,
  };
};
const tooExpensive = (ability: FullEntityAbility) =>
  props.attrs &&
  !ability.custom_fields?.cost?.passive &&
  !canUseAbility(ability, props.attrs, props.inCombat);

const pathSearchButton = (ability: FullEntityAbility) => {
  if (!ability.custom_fields?.path) {
    return;
  }
  if (state.search === ability.custom_fields.path) {
    state.search = "";
  } else {
    state.search = ability.custom_fields.path;
  }
};

const toggleShowPath = () => {
  state.options.showPath = !state.options.showPath;
  saveAbilityTableSettings();
};

const toggleSeparatePassive = () => {
  state.options.separatePassive = !state.options.separatePassive;
  saveAbilityTableSettings();
};

const saveAbilityTableSettings = () => {
  localStorage.setItem(
    ABILITY_TABLE_LOCAL_STORAGE,
    JSON.stringify(state.options),
  );
};
</script>

<style scoped>
thead.main-table {
  font-size: 15pt;
  text-align: left;
}
.sticky {
  position: sticky;
  top: 0;
  z-index: 4;
}
thead.main-table {
  /* works as min-height, so the header doesn't look weird without any functional components */
  height: 40px;
}
thead.main-table > tr > th {
  padding-top: 2px;
  padding-bottom: 2px;
}

th.no-padding,
td.no-padding {
  padding: 0;
}
.action-button {
  width: 42px;
}
.ability-name {
  font-size: 14pt;
}

.reset-font-weight {
  font-weight: 400;
}

.ability-effect-search {
  display: none;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.header-hover-show {
  display: none;
  position: absolute;
  right: 0;
}
.header-hover {
  position: relative;
}
.header-hover.visible > .header-hover-show,
.header-hover:hover > .header-hover-show,
.header-hover:focus > .header-hover-show,
.header-hover:focus-within > .header-hover-show {
  display: block;
  animation: fadeIn 0.1s;
}

/* skip tables in the ability table so it doesn't get too messy */
.ability-effect :deep(table) {
  display: none;
}

@container page (max-width: 600px) {
  .ability-path {
    display: none;
  }
}

@container page (max-width: 750px) {
  .ability-effect-search {
    display: flex;
  }
  .ability-effect {
    display: none;
  }
}
</style>
