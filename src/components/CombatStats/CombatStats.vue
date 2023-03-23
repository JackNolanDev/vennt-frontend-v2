<template>
  <div class="panel ml-16 mr-16 mb-64">
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
                :top="attrDisplayVal(attr)"
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
            <div class="margin">
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
          <div class="margin">
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
      <GiftDescription
        v-if="entity.entity.other_fields.gift"
        :gift="entity.entity.other_fields.gift"
        :showTitle="false"
      ></GiftDescription>
      <div v-if="entity.entity.other_fields.second_gift">
        <div class="separator thin"></div>
        <GiftDescription
          :gift="entity.entity.other_fields.second_gift"
          :showTitle="false"
        ></GiftDescription>
      </div>
    </div>
    <!-- SINGLE LINE STATS -->
    <div v-for="attr in singleRowAttrs" v-bind:key="attr">
      <div v-if="attr in attrs">
        <button
          v-on:click="selectAttr(attr)"
          class="btn basicBtn attrButton noSelect"
          v-bind:class="attrButtonClass(attr)"
        >
          <div class="basicBtnContents attrButtonContents cols-2 wide">
            <div class="alignRow">
              <div class="attrLabelWide">{{ attrShortName(attr) }}:</div>
              <div class="number">{{ attrDisplayVal(attr) }}</div>
            </div>
            <div v-if="singleSecondaryMap[attr]" class="alignRow">
              <div class="attrLabelWide">
                {{
                  attrShortName(singleSecondaryMap[attr] as EntityAttribute)
                }}:
              </div>
              <div class="number">
                {{
                  attrDisplayVal(singleSecondaryMap[attr] as EntityAttribute)
                }}
              </div>
            </div>
          </div>
        </button>
        <div v-if="showDropDown(attr)" class="card diceDropDown left right">
          <div class="margin">
            <div v-if="showUpdateDropdown">
              <AdjustAttributeVal
                v-if="ADJUST_SINGLE.has(attr)"
                :attr="attr"
                loc="combat-stats"
              ></AdjustAttributeVal>
              <CombatStatsDiceSection
                v-else-if="SHOW_DICE_SINGLE.has(attr)"
                :attrs="attrs"
                :attr="attr"
                :use-copyable-dice="useCopyableDice"
              ></CombatStatsDiceSection>
              <CombatStatsArmorSection
                v-else-if="attr === 'armor'"
                :attrs="attrs"
              ></CombatStatsArmorSection>
              <AttributeHelp v-else :attr="attr"></AttributeHelp>
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
import type {
  CollectedEntity,
  EntityAttribute,
  FullEntity,
  UpdatedEntityAttributes,
} from "@/utils/backendTypes";
import { computed, reactive } from "vue";
import BulletPointVue from "../Base/BulletPoint.vue";
import {
  attrShortName,
  entityAttributesMap,
  getMaxAttr,
  additionalCombatStatsAttrs,
} from "@/utils/attributeUtils";
import BaseFraction from "../Base/BaseFraction.vue";
import AttributeHelp from "../Attributes/AttributeHelp.vue";
import GiftDescription from "../Create/GiftDescription.vue";
import CombatStatsDiceSection from "./CombatStatsDiceSection.vue";
import CombatStatsItemSection from "./CombatStatsItemSection.vue";
import AdjustAttributeVal from "../Attributes/AdjustAttributeVal.vue";
import AdjustAttributeLink from "../Attributes/AdjustAttributeLink.vue";
import { useAccountInfoStore } from "@/stores/accountInfo";
import CombatStatsArmorSection from "./CombatStatsArmorSection.vue";
import CombatStatsAbilitiesSection from "./CombatStatsAbilitiesSection.vue";

const props = defineProps<{
  entity: CollectedEntity;
  entityAttrs?: UpdatedEntityAttributes;
  useCopyableDice: boolean;
  showItems?: boolean;
  showAbilities?: boolean;
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
  return map === undefined ? undefined : map.val;
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

const BASE_SINGLE_ROW_ATTRIBUTES: EntityAttribute[] = [
  "acc",
  "init",
  "speed",
  "armor",
  "L",
  "xp",
  "sp",
];

const singleRowAttrs = computed(() =>
  BASE_SINGLE_ROW_ATTRIBUTES.concat(additionalCombatStatsAttrs(props.entity))
);

const ADJUST_SINGLE: Set<EntityAttribute> = new Set(["xp", "sp"]);
const SHOW_DICE_SINGLE: Set<EntityAttribute> = new Set(["init", "casting"]);

const singleSecondaryMap = computed(() => {
  const map: Partial<Record<EntityAttribute, EntityAttribute>> = {};
  if (attrs.value.burden) {
    map.armor = "burden";
  }
  return map;
});

const showUpdateDropdown = computed(() => {
  const fullEntity = props.entity.entity as FullEntity;
  return (
    fullEntity.id !== undefined &&
    accountInfoStore.accountInfo &&
    fullEntity.owner === accountInfoStore.accountInfo.id
  );
});
</script>

<style scoped>
/* used for non-opennable stats */
.stat {
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

.margin {
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
  .panel {
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>
