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
          v-if="state.changelog"
          :entity="entityStore.entity"
          :attr="attr"
          :changelog="state.changelog"
        ></AttributeHistoryTable>
        <div v-else>Loading changelog</div>
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
        ></AdjustAttributeVal>
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
import type {
  EntityAttribute,
  FullEntityChangelog,
} from "@/utils/backendTypes";
import { computed, onBeforeMount, reactive } from "vue";
import BaseFraction from "../Base/BaseFraction.vue";
import BaseModal from "../Base/BaseModal.vue";
import AdjustAttributeLink from "./AdjustAttributeLink.vue";
import AdjustAttributeVal from "./AdjustAttributeVal.vue";
import AttributeHistoryTable from "./AttributeHistoryTable.vue";
import BaseButton from "../Base/BaseButton.vue";
import {
  fetchEntityChangelogApi,
  filterEntityChangelogApi,
} from "@/api/apiEntity";

const props = defineProps<{ attr: EntityAttribute }>();
const state = reactive<{ changelog?: FullEntityChangelog[] }>({
  changelog: undefined,
});
const entityStore = useEntityStore();

onBeforeMount(() => refetchChangelog());

const shortName = computed(() => attrShortName(props.attr));
const maxAttr = computed(() => getMaxAttr(props.attr));
const baseAttr = computed(() => getBaseAttr(props.attr));

const relatedAttrs: Partial<Record<EntityAttribute, EntityAttribute>> = {
  armor: "burden",
  burden: "armor",
  shield: "burden",
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
  () => state.changelog && state.changelog.length > 0
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
  state.changelog = [];
  if (entityStore.entity) {
    filterEntityChangelogApi(entityStore.entity.entity.id, {
      attributes: [props.attr],
    });
  }
};

const refetchChangelog = async (attr?: EntityAttribute) => {
  state.changelog = [];
  if (entityStore.entity) {
    state.changelog = await fetchEntityChangelogApi(
      entityStore.entity.entity.id,
      attr ?? props.attr
    );
  } else {
    console.log("entity missing");
  }
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
    padding-bottom: 8px;
  }
}
</style>
