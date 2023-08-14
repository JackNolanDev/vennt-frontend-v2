<template>
  <div class="combat-stats-panel ml-16 mr-16 mb-64">
    <div class="centeredText">
      <h2>{{ entity.entity.name }}</h2>
    </div>
    <div class="separator"></div>
    <!-- COMBAT STATS -->
    <div class="alignRow">
      <BulletPointVue :entity="entity.entity"></BulletPointVue>
      <h2>Combat Stats</h2>
    </div>
    <div>
      <div v-for="(attrRow, index) in combatStatsRows" v-bind:key="index">
        <div class="alignRow split gap">
          <button
            v-for="attr in attrRow"
            v-bind:key="attr"
            v-on:click="selectAttr(attr)"
            class="btn basicBtn attrButton noSelect"
            v-bind:class="attrButtonClass(attr)"
          >
            <div class="basicBtnContents attrButtonContents">
              <span class="fractionLabel">{{ attrShortName(attr) }}:</span>
              <BaseFraction
                :top="
                  !showFullHealth || attr === 'hero'
                    ? attrDisplayVal(attr)
                    : attrMaxDisplayVal(attr)
                "
                :bottom="attrMaxDisplayVal(attr)"
              ></BaseFraction>
            </div>
          </button>
        </div>
        <div v-for="(attr, j) in attrRow" v-bind:key="j">
          <div
            v-if="showDropDown(attr)"
            class="card diceDropDown"
            v-bind:class="dropdownClass(j, attrRow.length)"
          >
            <div class="combat-stats-margin">
              <div v-if="showUpdateDropdown">
                <AdjustAttributeVal
                  :attr="attr"
                  loc="combat-stats"
                ></AdjustAttributeVal>
                <div class="separator mt-8 mb-8"></div>
                <AdjustAttributeLink
                  :attr="attr"
                  class="wide"
                ></AdjustAttributeLink>
              </div>
              <AttributeHelp v-else :attr="attr"></AttributeHelp>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-24"></div>
    <CombatStatsSingleRowAttributes
      :single-row-attrs="combatSingleRowAttributes"
      :attrs="attrs"
      :custom-attrs="customAttrs"
      :entity="entity"
      :selected-attr="state.selectedAttr"
      :show-update-dropdown="showUpdateDropdown"
      :use-copyable-dice="useCopyableDice"
      @select-attr="selectAttr"
    ></CombatStatsSingleRowAttributes>
    <!-- ATTRIBUTES -->
    <div class="alignRow">
      <BulletPointVue :entity="entity.entity"></BulletPointVue>
      <h2>Attributes</h2>
    </div>
    <div v-for="(attrRow, index) in ATTRIBUTE_ROWS" v-bind:key="index">
      <div class="alignRow split gap">
        <button
          v-for="attr in attrRow"
          v-bind:key="attr"
          v-on:click="selectAttr(attr)"
          class="btn basicBtn attrButton noSelect"
          v-bind:class="attrButtonClass(attr)"
        >
          <div class="basicBtnContents attrButtonContents">
            <span class="attrLabel">{{ attrShortName(attr) }}:</span>
            <div class="number">{{ attrDisplayVal(attr) }}</div>
          </div>
        </button>
      </div>
      <div v-for="(attr, j) in attrRow" v-bind:key="j">
        <div
          v-if="showDropDown(attr)"
          class="card diceDropDown"
          v-bind:class="dropdownClass(j, attrRow.length)"
        >
          <div class="combat-stats-margin">
            <CombatStatsDiceSection
              :attrs="attrs"
              :attr="attr"
              :use-copyable-dice="useCopyableDice"
            ></CombatStatsDiceSection>
            <div v-if="showUpdateDropdown">
              <div class="separator mt-8 mb-8"></div>
              <AdjustAttributeLink
                :attr="attr"
                class="wide"
              ></AdjustAttributeLink>
            </div>
            <div v-else>
              <div class="separator mt-8 mb-8"></div>
              <AttributeHelp :attr="attr" class="mutedText"></AttributeHelp>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-24"></div>
    <!-- CUSTOM SINGLE LINE STATS -->
    <button
      v-if="entity.entity.other_fields.gift"
      v-on:click="selectAttr('gift')"
      class="btn basicBtn attrButton noSelect"
      v-bind:class="attrButtonClass('gift')"
    >
      <div class="basicBtnContents attrButtonContents">
        Gift: {{ entity.entity.other_fields.gift
        }}<span v-if="entity.entity.other_fields.second_gift" class="ml-8">
          / {{ entity.entity.other_fields.second_gift }}</span
        >
      </div>
    </button>
    <div
      v-if="showDropDown('gift')"
      class="card column diceDropDown left right"
    >
      <GiftDescriptionV14
        v-if="entity.entity.other_fields.gift"
        :gift="entity.entity.other_fields.gift"
        :showTitle="false"
      ></GiftDescriptionV14>
      <div v-if="entity.entity.other_fields.second_gift">
        <div class="separator thin"></div>
        <GiftDescriptionV14
          :gift="entity.entity.other_fields.second_gift"
          :showTitle="false"
        ></GiftDescriptionV14>
      </div>
    </div>
    <button
      v-if="entity.entity.other_fields.cog_type"
      v-on:click="selectAttr('cog_type')"
      class="btn basicBtn attrButton noSelect"
      v-bind:class="attrButtonClass('cog_type')"
    >
      <div class="basicBtnContents attrButtonContents">
        Cog Type: {{ cogTypeName(entity.entity.other_fields.cog_type) }}
      </div>
    </button>
    <div
      v-if="showDropDown('cog_type')"
      class="card column diceDropDown left right"
    >
      <CogTypeDescription
        :cog_type="entity.entity.other_fields.cog_type"
      ></CogTypeDescription>
    </div>
    <!-- SINGLE LINE STATS -->
    <CombatStatsSingleRowAttributes
      :single-row-attrs="singleRowAttrs"
      :attrs="attrs"
      :custom-attrs="customAttrs"
      :entity="entity"
      :selected-attr="state.selectedAttr"
      :show-update-dropdown="showUpdateDropdown"
      :use-copyable-dice="useCopyableDice"
      @select-attr="selectAttr"
    ></CombatStatsSingleRowAttributes>
    <!-- ITEMS -->
    <CombatStatsItemSection
      v-if="showItems && entity.items.length > 0"
      :entity="entity"
    ></CombatStatsItemSection>
    <!-- ABILITIES -->
    <CombatStatsAbilitiesSection
      v-if="showAbilities && entity.abilities.length > 0"
      :entity="entity"
      :attrs="attrs"
    ></CombatStatsAbilitiesSection>
  </div>
</template>

<script setup lang="ts">
import {
  validAttributes,
  type CollectedEntity,
  type EntityAttribute,
  type FullEntity,
  type UpdatedEntityAttributes,
} from "@/utils/backendTypes";
import { computed, reactive } from "vue";
import BulletPointVue from "../Base/BulletPoint.vue";
import {
  attrShortName,
  entityAttributesMap,
  getMaxAttr,
  additionalCombatStatsAttrs,
} from "@/utils/attributeUtils";
import { cogTypeName } from "@/utils/copy/createCogTypeOptions";
import BaseFraction from "../Base/BaseFraction.vue";
import AttributeHelp from "../Attributes/AttributeHelp.vue";
import GiftDescriptionV14 from "../Create/GiftDescriptionV14.vue";
import CombatStatsDiceSection from "./CombatStatsDiceSection.vue";
import CombatStatsItemSection from "./CombatStatsItemSection.vue";
import AdjustAttributeVal from "../Attributes/AdjustAttributeVal.vue";
import AdjustAttributeLink from "../Attributes/AdjustAttributeLink.vue";
import { useAccountInfoStore } from "@/stores/accountInfo";
import CombatStatsAbilitiesSection from "./CombatStatsAbilitiesSection.vue";
import CogTypeDescription from "../Cog/CogTypeDescription.vue";
import CombatStatsSingleRowAttributes from "./CombatStatsSingleRowAttributes.vue";

const props = defineProps<{
  entity: CollectedEntity;
  entityAttrs?: UpdatedEntityAttributes;
  useCopyableDice: boolean;
  showItems?: boolean;
  showAbilities?: boolean;
  showFullHealth?: boolean;
}>();

interface CombatStatsState {
  selectedAttr: string | undefined;
}
const state: CombatStatsState = reactive({ selectedAttr: undefined });

const accountInfoStore = useAccountInfoStore();

const attrs = computed(() => {
  if (props.entityAttrs) {
    return props.entityAttrs;
  }
  return entityAttributesMap(props.entity);
});

const combatStatsRows = computed((): EntityAttribute[][] => {
  if (props.entity.entity.type === "CHARACTER") {
    return [
      ["hp", "vim"],
      ["mp", "hero"],
    ];
  }
  return [["hp"], ["vim", "mp"]];
});

const showDropDown = (attr: string) => {
  return state.selectedAttr === attr;
};

const selectAttr = (attr: string) => {
  if (showDropDown(attr)) {
    state.selectedAttr = undefined;
  } else {
    state.selectedAttr = attr;
  }
};
const attrButtonClass = (attr: string) => ({ selected: showDropDown(attr) });
const dropdownClass = (index: number, length: number) => ({
  left: index === 0,
  right: index === length - 1,
});

const attrDisplayVal = (attr: EntityAttribute) => {
  const map = attrs.value[attr];
  return map?.val;
};

const attrMaxDisplayVal = (attr: EntityAttribute) => {
  const attrMax = getMaxAttr(attr);
  if (!attrMax) {
    return undefined;
  }
  return attrDisplayVal(attrMax);
};

const ATTRIBUTE_ROWS: EntityAttribute[][] = [
  ["per", "tek", "agi"],
  ["dex", "int", "spi"],
  ["str", "wis", "cha"],
];

const COMBAT_SINGLE_ROW_ATTRIBUTES: EntityAttribute[] = [
  "alerts",
  "burning",
  "bleeding",
  "paralysis",
  "stun",
  "agi_dmg",
  "cha_dmg",
  "dex_dmg",
  "int_dmg",
  "per_dmg",
  "spi_dmg",
  "str_dmg",
  "tek_dmg",
  "wis_dmg",
];

const combatSingleRowAttributes = computed(() => {
  if (props.entity.entity.other_fields.in_combat) {
    return ["actions", "reactions", ...COMBAT_SINGLE_ROW_ATTRIBUTES];
  }
  return COMBAT_SINGLE_ROW_ATTRIBUTES;
});

const BASE_SINGLE_ROW_ATTRIBUTES: EntityAttribute[] = [
  "L",
  "init",
  "speed",
  "armor",
  "xp",
  "sp",
  "acc",
  "reach",
  "radius",
  "recovery_shock",
];

const customAttrs = computed(() =>
  Object.keys(attrs.value).filter((attr) => !validAttributes.includes(attr))
);

const singleRowAttrs = computed(() =>
  // dedupe values
  Array.from(
    new Set(
      BASE_SINGLE_ROW_ATTRIBUTES.concat(
        additionalCombatStatsAttrs(props.entity)
      ).concat(customAttrs.value)
    )
  )
);

const showUpdateDropdown = computed(() => {
  const fullEntity = props.entity.entity as FullEntity;
  return (
    fullEntity.id !== undefined &&
    accountInfoStore.accountInfo &&
    fullEntity.owner === accountInfoStore.accountInfo.id
  );
});
</script>

<style>
/* used for non-openable stats */
.combat-stat {
  font-size: 16pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px 10px 8px;
}

.attrButton {
  width: 100%;
  background-color: var(--background-highlight);
  border-radius: var(--border-radius);
  margin-bottom: 8px;
}
.attrButton.selected {
  margin-bottom: 0px;
  border-radius: var(--border-radius) var(--border-radius) 0px 0px;
  padding-bottom: 7px;
  border-bottom: 1px var(--border) solid;
}
.attrButtonContents {
  font-size: 16pt;
  text-align: left;
}

.combat-stats-margin {
  margin: 8px;
  width: 100%;
}

.diceDropDown {
  margin-bottom: 8px;
}
.diceDropDown.left {
  border-top-left-radius: 0px;
}
.diceDropDown.right {
  border-top-right-radius: 0px;
}

.fractionLabel {
  min-width: 64px;
}
.attrLabel {
  min-width: 56px;
}
.attrLabelWide {
  min-width: 88px;
  margin-right: 8px;
}

/* Mobile Styles */
@media screen and (max-width: 396px) {
  .combat-stats-panel {
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>
