<template>
  <form>
    <label v-bind:for="adjustReasonID" class="labelText">
      Adjust {{ baseInTitle ? "Base" : "" }} {{ attrDisplayName }} Values:
    </label>
    <input
      type="text"
      @keyup.enter="jumpToAdjustField"
      v-model="state.reason"
      placeholder="Reason for update (not required)"
      title="Press Enter to jump to the next field"
      v-bind:id="adjustReasonID"
      v-bind:class="inputAdjustFieldClass"
      class="input mt-4"
    />
    <div class="alignRow mt-4">
      <label v-bind:for="adjustFieldID" class="nowrap mr-8">
        Adjust (+/-) {{ attrDisplayName }}:
      </label>
      <input
        type="number"
        @keyup.enter="adjustAttrFromAdjustField"
        v-model="state.adjust"
        placeholder="0"
        title="Press Enter to Submit"
        v-bind:id="adjustFieldID"
        v-bind:class="inputAdjustFieldClass"
        class="input"
      />
    </div>
    <p v-if="showError" class="errorText pt-12 mt-2 mb-2">{{ adjustError }}</p>
    <BaseButton
      v-if="submitBtn"
      :disabled="adjustButtonDisabled"
      @click="adjustAttrFromAdjustField"
      class="primary wide mt-4 center"
    >
      Submit Adjustment
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import {
  adjustAttrsAPI,
  attrFullName,
  generateDefaultAdjustMsg,
  isCustomAttr,
  MIN_ZEROS,
} from "@/utils/attributeUtils";
import {
  ATTRIBUTES_SET,
  ATTRIBUTE_MAX,
  ATTRIBUTE_MIN,
  CHANGELOG_MAX,
  type EntityAttribute,
  type PartialEntityAttributes,
} from "vennt-library";
import { computed, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{
  attr: EntityAttribute;
  loc: string;
  submitBtn?: boolean;
}>();
const emit = defineEmits<{
  (e: "updateTriggered"): void;
  (e: "updateComplete"): void;
}>();
const state = reactive({ reason: "", adjust: "" });
const entityStore = useEntityStore();

const attrDisplayName = computed(() => attrFullName(props.attr));
const adjustReasonID = computed(
  () => `${props.loc}-${props.attr}-adjustReason`
);
const adjustFieldID = computed(() => `${props.loc}-${props.attr}-adjust`);
const adjustVal = computed(() => {
  const adjust = parseInt(state.adjust);
  return isNaN(adjust) ? 0 : adjust;
});
const adjustError = computed(() => {
  if (adjustVal.value === 0) {
    return `${state.adjust} must adjust current value`;
  }
  const currentVal = entityStore.entity?.entity.attributes[props.attr];
  const val = (currentVal === undefined ? 0 : currentVal) + adjustVal.value;
  if (MIN_ZEROS.has(props.attr) && val < 0) {
    return `${attrDisplayName.value} cannot be negative`;
  }
  if (
    ATTRIBUTES_SET.has(props.attr) &&
    (val < ATTRIBUTE_MIN || val > ATTRIBUTE_MAX)
  ) {
    return `${attrDisplayName.value} cannot exceed attribute caps`;
  }
  if (state.reason.length > CHANGELOG_MAX) {
    return "Reason is too long";
  }
  return false;
});
const adjustButtonDisabled = computed(() => adjustError.value !== false);
const showError = computed(
  () => adjustButtonDisabled.value && state.adjust !== ""
);
const inputAdjustFieldClass = computed(() =>
  showError.value ? "invalid" : ""
);
const baseInTitle = computed(() => {
  if (isCustomAttr(props.attr)) {
    return false;
  }
  return !["xp", "sp", "trii"].includes(props.attr);
});

const jumpToAdjustField = () =>
  document.getElementById(adjustFieldID.value)?.focus();

const adjustAttrFromAdjustField = async () => {
  if (adjustError.value === false && entityStore.entity) {
    const trimmedGivenReason = state.reason.trim();
    const reason =
      trimmedGivenReason !== ""
        ? trimmedGivenReason
        : generateDefaultAdjustMsg(props.attr, adjustVal.value);
    const attrs: PartialEntityAttributes = {};
    attrs[props.attr] = adjustVal.value;
    emit("updateTriggered");
    state.adjust = "";
    state.reason = "";
    await adjustAttrsAPI(
      entityStore.entity,
      entityStore.entityAttributes,
      attrs,
      { msg: reason }
    );
    emit("updateComplete");
  }
};
</script>
