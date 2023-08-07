<template>
  <div v-for="attr in singleRowAttrs" v-bind:key="attr">
    <div v-if="attr in attrs && !hideZeroAttr(attr)">
      <button
        v-on:click="emit('selectAttr', attr)"
        class="btn basicBtn attrButton noSelect"
        v-bind:class="{ selected: selectedAttr === attr }"
      >
        <div
          v-if="fractionMap[attr]"
          class="basicBtnContents attrButtonContents alignRow wide"
        >
          <div class="attrLabelWide">{{ attrShortName(attr) }}:</div>
          <BaseFraction
            :top="fractionMap[attr].top"
            :bottom="fractionMap[attr].bottom"
          ></BaseFraction>
        </div>
        <div v-else class="basicBtnContents attrButtonContents cols-2 wide">
          <div class="alignRow">
            <div class="attrLabelWide nowrap title-case">
              {{ attrShortName(attr) }}:
            </div>
            <div class="number">{{ attrs[attr]?.val }}</div>
          </div>
          <div v-if="singleSecondaryMap[attr]" class="alignRow">
            <div class="attrLabelWide">
              {{ attrShortName(singleSecondaryMap[attr]) }}:
            </div>
            <div class="number">
              {{ attrs[singleSecondaryMap[attr]]?.val }}
            </div>
          </div>
        </div>
      </button>
      <div v-if="attr === selectedAttr" class="card diceDropDown left right">
        <div class="combat-stats-margin">
          <div v-if="showUpdateDropdown">
            <AdjustAttributeVal
              v-if="ADJUST_SINGLE.has(attr) || customAttrs.includes(attr)"
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
            <CombatStatsBleedingSection
              v-else-if="attr === 'bleeding'"
            ></CombatStatsBleedingSection>
            <CombatStatsBurningSection
              v-else-if="attr === 'burning'"
            ></CombatStatsBurningSection>
            <CombatStatsRecoveryShockSection
              v-else-if="attr === 'recovery_shock'"
            ></CombatStatsRecoveryShockSection>
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
</template>

<script setup lang="ts">
import type {
  CollectedEntity,
  EntityAttribute,
  UpdatedEntityAttributes,
} from "@/utils/backendTypes";
import { totalDC } from "@/utils/itemUtils";
import { computed } from "vue";
import { attrShortName } from "@/utils/attributeUtils";
import BaseFraction from "../Base/BaseFraction.vue";
import AttributeHelp from "../Attributes/AttributeHelp.vue";
import CombatStatsDiceSection from "./CombatStatsDiceSection.vue";
import AdjustAttributeVal from "../Attributes/AdjustAttributeVal.vue";
import AdjustAttributeLink from "../Attributes/AdjustAttributeLink.vue";
import CombatStatsArmorSection from "./CombatStatsArmorSection.vue";
import CombatStatsBleedingSection from "./CombatStatsBleedingSection.vue";
import CombatStatsBurningSection from "./CombatStatsBurningSection.vue";
import CombatStatsRecoveryShockSection from "./CombatStatsRecoveryShockSection.vue";

const props = defineProps<{
  entity: CollectedEntity;
  singleRowAttrs: EntityAttribute[];
  attrs: UpdatedEntityAttributes;
  selectedAttr?: EntityAttribute;
  customAttrs: EntityAttribute[];
  showUpdateDropdown?: boolean;
  useCopyableDice: boolean;
}>();
const emit = defineEmits<{
  (e: "selectAttr", state: EntityAttribute): void;
}>();

const HIDE_ZERO_ATTRIBUTES = new Set([
  "recovery_shock",
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
]);

const ADJUST_SINGLE: Set<EntityAttribute> = new Set([
  "xp",
  "sp",
  "trii",
  "alerts",
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
]);
const SHOW_DICE_SINGLE: Set<EntityAttribute> = new Set(["init", "casting"]);

const hideZeroAttr = (attr: EntityAttribute): boolean =>
  props.attrs[attr]?.val === 0 && HIDE_ZERO_ATTRIBUTES.has(attr);

const singleSecondaryMap = computed(() => {
  const map: Record<EntityAttribute, EntityAttribute> = {};
  if (props.attrs.burden) {
    map.armor = "burden";
  }
  return map;
});

const fractionMap = computed(
  (): Record<EntityAttribute, { top?: number; bottom?: number }> => ({
    bluespace: {
      top: totalDC(props.entity.items),
      bottom: props.attrs.bluespace?.val,
    },
    alerts: {
      top: props.attrs.alerts?.val,
      bottom: props.attrs.max_alerts?.val,
    },
    trii: {
      top: props.attrs.trii?.val,
      bottom: props.attrs.max_trii?.val,
    },
  })
);
</script>