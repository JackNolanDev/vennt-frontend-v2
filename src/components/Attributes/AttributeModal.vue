<template>
  <BaseModal
    v-if="entityStore.entity"
    :hideButtons="true"
    :large="true"
    @closeModal="closeModal"
  >
    <template #title>Edit {{ attrFullName(attr) }}</template>
    <div class="alignRow split wrap mb-16">
      <div
        class="alignRow labelText"
        :title="entityStore.entityAttributes[attr]?.reason?.join('\n')"
      >
        Base {{ shortName }}:
        <span v-if="attr in entityStore.entity.entity.attributes" class="ml-8">
          <BaseFraction
            v-if="maxAttr && maxAttr in entityStore.entityAttributes"
            :top="entityStore.entity.entity.attributes[attr]"
            :bottom="entityStore.entityAttributes[maxAttr]?.val"
          ></BaseFraction>
          <span v-else class="number">{{
            entityStore.entity.entity.attributes[attr]
          }}</span>
        </span>
        <span v-else class="ml-8">Not defined yet</span>
        <span
          v-if="
            entityStore.entityAttributes[attr]?.val !==
            entityStore.entity.entity.attributes[attr]
          "
          class="mutedText ml-8"
          >(Current Value:
          <span class="number">{{
            entityStore.entityAttributes[attr]?.val
          }}</span
          >)</span
        >
      </div>
      <BaseButton
        v-if="isRemovableCustomAttr"
        @click="removeCustomAttr"
        icon="delete_outline"
        >Delete Custom Attribute</BaseButton
      >
      <AdjustAttributeLink
        v-if="maxAttr"
        :attr="maxAttr"
        @click="refetchChangelog(maxAttr)"
      ></AdjustAttributeLink>
      <AdjustAttributeLink
        v-if="baseAttr"
        :attr="baseAttr"
        @click="refetchChangelog(baseAttr)"
      ></AdjustAttributeLink>
      <AdjustAttributeLink
        v-if="relatedAttr"
        :attr="relatedAttr"
        @click="refetchChangelog(relatedAttr)"
      ></AdjustAttributeLink>
    </div>
    <div class="cols-2 gap-16 table-split">
      <div class="attr-history-side">
        <AttributeHistoryTable
          v-if="changelog"
          :entity="entityStore.entity"
          :attr="attr"
          :changelog="changelog"
        ></AttributeHistoryTable>
        <!-- TODO: Would be cool to get a little loading spinner here -->
        <div v-else>Loading changelog</div>
        <!-- TODO: Should probably make these initially hidden & have confirmation modal attached to them -->
        <BaseButton
          v-if="showResetButton"
          @click="resetButton"
          icon="restart_alt"
          :title="`Refill your ${shortName} to full. Warning: this will clear your ${shortName} history.`"
          class="wide"
          >Reset {{ shortName }} to Full</BaseButton
        >
        <BaseButton
          v-if="showClearHistoryButton"
          @click="clearHistoryButton"
          icon="delete_outline"
          :title="`Delete your ${shortName} history.`"
          class="wide"
          >Clear History</BaseButton
        >
      </div>
      <div>
        <AdjustAttributeVal
          :attr="attr"
          loc="modal"
          :submitBtn="true"
          @update-complete="refetchChangelog"
          class="mb-16"
        ></AdjustAttributeVal>
        <AttributeLineGraph
          v-if="changelog && changelog.length > 0"
          :attr="attr"
        ></AttributeLineGraph>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import router, { ENTITY_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";
import {
  attrFullName,
  attrShortName,
  getBaseAttr,
  getMaxAttr,
} from "@/utils/attributeUtils";
import { validAttributes, type EntityAttribute } from "@/utils/backendTypes";
import { computed, onBeforeMount } from "vue";
import BaseFraction from "../Base/BaseFraction.vue";
import BaseModal from "../Base/BaseModal.vue";
import AdjustAttributeLink from "./AdjustAttributeLink.vue";
import AdjustAttributeVal from "./AdjustAttributeVal.vue";
import AttributeHistoryTable from "./AttributeHistoryTable.vue";
import BaseButton from "../Base/BaseButton.vue";
import AttributeLineGraph from "./AttributeLineGraph.vue";

const props = defineProps<{ attr: EntityAttribute }>();
const entityStore = useEntityStore();

onBeforeMount(() => refetchChangelog());

const changelog = computed(() => entityStore.changelogs[props.attr]?.changelog);
const shortName = computed(() => attrShortName(props.attr));
const maxAttr = computed(() => getMaxAttr(props.attr));
const baseAttr = computed(() => getBaseAttr(props.attr));

const relatedAttrs: Partial<Record<EntityAttribute, EntityAttribute>> = {
  armor: "burden",
  burden: "armor",
  shield: "burden",
  agi_dmg: "agi",
  cha_dmg: "cha",
  dex_dmg: "dex",
  int_dmg: "int",
  per_dmg: "per",
  spi_dmg: "spi",
  str_dmg: "str",
  tek_dmg: "tek",
  wis_dmg: "wis",
  actions: "actions_on_turn",
  reactions: "reactions_on_turn",
};

const relatedAttr = computed(() => relatedAttrs[props.attr]);
const showResetButton = computed(
  () =>
    entityStore.entity &&
    maxAttr.value !== undefined &&
    entityStore.entityAttributes[maxAttr.value]?.val !==
      entityStore.entityAttributes[props.attr]?.val &&
    props.attr !== "hero"
);
const showClearHistoryButton = computed(
  () => changelog.value && changelog.value.length > 0
);
const isRemovableCustomAttr = computed(
  () =>
    !validAttributes.includes(props.attr) &&
    !showClearHistoryButton.value &&
    typeof entityStore.entity?.entity.attributes[props.attr] === "number"
);

const closeModal = () => {
  const query = { ...router.currentRoute.value.query };
  delete query.attr;
  router.push({
    name: router.currentRoute.value.name ?? ENTITY_ROUTE,
    params: router.currentRoute.value.params,
    query,
  });
};
const resetButton = () => {
  if (entityStore.entity && maxAttr.value) {
    const newValue = entityStore.entityAttributes[maxAttr.value]?.val;
    if (newValue !== undefined) {
      entityStore.updateEntityAttributes(entityStore.entity.entity.id, {
        attributes: {
          [props.attr]: newValue,
        },
      });
      clearHistoryButton();
    }
  }
};
const clearHistoryButton = () => {
  entityStore.clearChangelog([props.attr]);
};
const removeCustomAttr = async () => {
  if (!entityStore.entity) {
    return;
  }
  const attributes = entityStore.entity.entity.attributes;
  delete attributes[props.attr];
  await entityStore.updateEntity({ attributes });
  closeModal();
};

const refetchChangelog = async (attr?: EntityAttribute) => {
  entityStore.fetchChangelog(attr ?? props.attr);
};
</script>

<style scoped>
/* Mobile Styles */
@media screen and (max-width: 600px) {
  .table-split {
    grid-template-columns: 1fr;
  }
  .attr-history-side {
    border-bottom: 2px solid var(--border);
    padding-bottom: 16px;
  }
}
</style>
